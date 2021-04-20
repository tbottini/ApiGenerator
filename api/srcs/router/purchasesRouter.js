const Router = require("../routerClass/router");
const stripe = require("../ecommerce/stripe.js");
const parse = require("../parse/parser");
const mjml = require("../email/mjml");
const userController = require("../../model/users").getController();
const purchasesElemController = require("../../model/purchases_elements").getController();
const ERROR = require("../parse/error");

class PurchasesRouter extends Router {
  constructor(param) {
    super(param);
  }

  init() {
    this.attach();
  }

  wrapIfExist(pastille, str, addCr = false) {
    const CR = "<br />";
    if (!str) {
      console.log(str == null);
      return "";
    }
    return pastille + " : " + str + (addCr ? CR : "");
  }

  //construit une adresse en récupérant les informations
  //dans un object global "a"
  buildAddressString(prefix, a) {
    const CR = "<br />";
    prefix = "addr" + prefix + "_";
    const PASTILLE_POSTAL = "Informations Complémentaires";
    var lastname = this.wrapIfExist("Nom", a[prefix + "lastname"], true),
      suppl = this.wrapIfExist(
        PASTILLE_POSTAL,
        a[prefix + "other_indication"],
        true
      ),
      firstname = this.wrapIfExist("Prénom", a[prefix + "firstname"], true),
      nb = a[prefix + "number"],
      voie = a[prefix + "name"],
      code = a[prefix + "code"],
      city = a[prefix + "city"];
    console.log(suppl);

    //if null or undefined set as empty string
    nb = nb || "";
    voie = voie || "";
    if (code == null) code = ""; // code may be == 0 int
    city = city || "";

    console.log("suupl ", suppl);

    var postal = city || code ? "Code Postal : " + code + " " + city + CR : "";
    var address = nb || voie ? "Voie : " + nb + " " + voie + CR : "";
    var name = lastname + firstname;

    return name + suppl + address + postal;
  }

  //TODO ajouter achat au nom de livré à l'adresse
  buildAddress(a) {
    const CR = "<br />";
    var livraisonAddress = this.buildAddressString("", a);
    var facturAddress = this.buildAddressString("_factur", a);

    if (facturAddress)
      facturAddress = CR + "Adresse de Facturation" + CR + facturAddress;

    return livraisonAddress + facturAddress;
  }

  attach() {
    this.setterRoute();
    this.router.post("/buy", async (req, res) => {
      if (!req.body.cart) return res.json({ error: "missing cart attribute" });

      if (!req.session.id_user) return res.json({ error: "no user log" });

      const insertValues = await this.checkRequiredParameters(req.body);
      if (insertValues.error) return res.json(insertValues);

      const total = await this.cartCalculation(req.body.cart);

      console.log(total);

      const user = await userController.get(
        req.session.id_user,
        "id",
        "email, lastname, firstname",
        false
      );
      console.log("user", user);

      var purchaseInfo = insertValues;
      purchaseInfo.id_user = req.session.id_user;
      purchaseInfo.transport_cost = total.shippingPrice;
      purchaseInfo.total_price = total.total;
      purchaseInfo.shipped = "false";

      const purchase = await this.controller.insert(purchaseInfo);

      console.log("purchases insert - ", purchase);
      const emailInformation = this.buildMailRecap(purchase, total.cart, user);

      this.sendMailRecap(user.email, emailInformation);

      //insert link purchases and book
      await Promise.all(
        total.cart.map(purchaseElem => {
          return purchasesElemController.insert({
            id_purchase: purchase.id,
            id_poem: purchaseElem.id,
            quantity: purchaseElem.quantity
          });
        })
      );
      res.json(purchase);
    });
    this.router.get("/", async (req, res) => this.getAll(req, res));
    this.router.get("/:id", (req, res) => this.get(req, res));
    this.router.post("/calculation", (req, res) => this.calculation(req, res));
  }

  async getAll(req, res) {
    if (!req.session.is_admin) return res.json(ERROR.adminRight);
    var params = Object.entries(req.query);

    if (params.length) {
      if (this.getUnkown(params).length)
        return res.json({ error: "bad params" });

      var filter = await this.getFilter(params);
      console.log("filter", filter);
      var sort = this.getSort(params);
    }

    return res.json(await this.controller.getAll(filter, sort));
  }

  async cartCalculation(cart) {
    if (!cart) return { error: "cart missed" };
    cart.forEach(article => {
      if (!article.id) return { error: "no id provide" };
      if (!/^[0-9]*$/.test(article.id))
        return { error: "bad id provide for items" };
      else if (!article.qty) return { error: "no qantity provide" };
    });

    // - calculate total price
    return await this.controller.calculation(cart);
  }

  createDescriptionPurchase(purchaseInformation, email) {
    return (
      "Achat de " +
      purchaseInformation.cart.length +
      " livres de " +
      email +
      " : " +
      purchaseInformation.cart
        .map(
          book => (book.quantity > 1 ? book.quantity + " x " : "") + book.title
        )
        .join(", ")
    );
  }

  //allows to calculate the value of a shopcart
  //req.body.cart = [list of id poem...]
  //return secret intent payment for conclude stripe paiement
  async calculation(req, res) {
    console.log("/calculation");

    if (!req.session.id_user) return res.json(ERROR.unlog);

    var { cart } = req.body;

    const user = await userController.get(
      req.session.id_user,
      "id",
      "email",
      false
    );

    // - calculate total price
    const total = await this.cartCalculation(cart);
    if (!total.error) {
      console.log(total);
      return res.json(
        await stripe.generatePayment(
          total.total,
          req.session.id_user,
          this.createDescriptionPurchase(total, user.email)
        )
      );
    }
    return res.json(total);
  }

  // build mail information for recap of purchase
  buildMailRecap(purchase, cart, user) {
    return {
      achat: cart.map(purchase => {
        var priceStr =
          (purchase.quantity > 1 ? purchase.quantity + " x " : "") +
          purchase.price;

        return {
          title: purchase.title,
          src:
            "https://editions-brunodoucey.com/api/static/image/" +
            purchase.illustration,
          price: priceStr
        };
      }),
      frais_port: purchase.transport_cost,
      total: purchase.total_price,
      addr: this.buildAddress(purchase),
      user,
      phone: purchase.phone
    };
  }

  sendMailRecap(to, purchase) {
    mjml
      .panierUser(purchase)
      .send(to, "Recapitulatif Achat Editions Bruno Doucey");

    const { CONTACT_MAIL } = process.env;
    console.log("contact mail is ", CONTACT_MAIL);

    mjml
      .panierAdmin(purchase)
      .send(CONTACT_MAIL, "Achat - Éditions Bruno Doucey");
    return { msg: "the email has been sent" };
  }

  async get(req, res) {
    if (!/^[0-9]*$/.test(req.params.id))
      return res.json({ error: "bad format for id" });
    var id = parse.secureSql(req.params.id);
    console.log("id", id);
    return res.json(await this.controller.get(id));
  }
}

module.exports = PurchasesRouter;
