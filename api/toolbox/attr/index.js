const Int = require("./int");
const error = require("../error");
const parse = require("../parser");

class Index extends Int {
  constructor(param) {
    super(param);
    this.type = "index";
  }

  //variable without insert value, automatic
  strInsert(tableName) {
    return (
      "(select 1 + (select " +
      this.name +
      " from " +
      tableName +
      " order  by " +
      this.name +
      " desc limit 1))"
    );
  }

  //parsing identique à celui pour les int

  async updateAttr(controller, params) {
    let currentIndex =
      "(select index from " +
      controller.name +
      " where id = " +
      params.id +
      ")";
    let idCurrentElem =
      "(select id from " +
      controller.name +
      " where " +
      this.name +
      " = " +
      params.value +
      ")";

    //swap d'index dans les entrées
    await controller.update(idCurrentElem, this.name, currentIndex);
    await controller.update(params.id, params.attr, params.value);
  }

  async extraRoute(router, controller) {
    console.log("extra route added");
    router.post("/swap", async (req, res) => {
      console.log("TEST", req.body);

      if (!req.body.newIndex || !req.body.currentIndex)
        return res.json(error.uncomplete);

      if (!parse.int(req.body.newIndex) || !parse.int(req.body.currentIndex))
        return res.json(error.badType("int"));
      console.log("test2");

      var elem = await controller.get(req.body.newIndex, this.name);
      if (!elem) return res.json(error.unexist);
      var celem = await controller.get(req.body.currentIndex, this.name);
      if (!celem) return res.json(error.unexist);
      await controller.set("id", celem.id, this.name, elem[this.name]);
      await controller.set("id", elem.id, this.name, celem[this.name]);
      return res.json({ msg: "swap succesfull" });
    });
  }
}

module.exports = Index;
