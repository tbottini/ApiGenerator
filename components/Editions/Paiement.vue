<template>
  <div v-if="form">
    <h3>1. CONNEXION</h3>
    <p><label>vous êtes connecté</label></p>
    <LivraisonInformation ref="liv" :livInfo="form.livInfo" />
    <PaiementInformation ref="paie" />
    <hr />
    <div>
      <input
        type="checkbox"
        class="inline"
        style="display: inline"
        :value="true"
        v-model="cgvAcceptation"
      />
      <p
        class="tiny-text inline color-1"
        :class="{ 'error-cgv': this.formSend && !this.cgvAcceptation }"
        style="display: inline"
      >
        J'ai lu et j'accepte
        <a href="/cgv.html">les conditions générales de vente.</a>
      </p>
    </div>
    <p class="error-msg">{{ error }}</p>
    <ThemeButton
      class="button2 fs-2 w-30 paiement-button"
      @click.native="proceedPaiement"
      >PAIEMENT</ThemeButton
    >
  </div>
</template>
<script>
export default {
  props: {
    user: {
      required: true
    },
    shopcart: {
      required: true
    }
  },

  data() {
    return {
      cgvAcceptation: false,
      formSend: false,
      form: {
        persoInfo: {
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          email: this.user.email,
          password: "",
          confirmationPassword: "",
          newsletter: this.user.follow_newsletter
        },
        livInfo: {
          firstname: this.user.addr_firstname,
          lastname: this.user.addr_lastname,
          name: this.user.addr_name,
          number: this.user.addr_number,
          other: this.user.addr_other_indication,
          code: this.user.addr_code,
          city: this.user.addr_city,
          phone: this.user.phone,
          fname: this.user.addr_factur_name,
          fnumber: this.user.addr_factur_number,
          fother: this.user.addr_factur_other_indication,
          fcode: this.user.addr_factur_code,
          fcity: this.user.addr_factur_city
        },
        paie: {}
      },
      error: ""
    };
  },
  methods: {
    async checkSecurity() {
      const liv = this.$refs.liv.validate();

      console.log("LIV", liv);

      this.formSend = true;
      if (!this.cgvAcceptation)
        return {
          error: "Vous devez accepter les conditions générale de vente."
        };

      if (!liv) return { error: "information de livraison incomplete" };

      const confirm = await this.$refs.paie.submit();
      console.log("confirm", confirm);
      if (!confirm) return { error: "" };
      if (confirm.error) return { error: "information bancaire invalide" };
      else return true;
    },
    async pushPurchases() {
      const liv = this.$refs.liv.get();
      const postObject = this.translate(liv);

      postObject.cart = this.$store.getters.panier().map(a => {
        return { id: a.id, quantity: a.qty };
      });

      //this.$emit("paiementStarting");
      this.$axios.post("/api/purchases/buy", postObject).then(r => {
        const purchase = r.data;
        console.log(purchase);

        this.$emit("paiementSuccess");
      });
    },
    async proceedPaiement() {
      var confirm = await this.checkSecurity();

      if (confirm.error) {
        console.log("confirm error", confirm.error);
        this.error = confirm.error;
        return;
      }
      this.pushPurchases();

      //this.$emit("paiementComplete");
    },
    translate(l) {
      const factur_number = l.fnumber == null ? null : parseInt(l.fnumber);
      const number = l.number == null ? null : parseInt(l.number);

      var obj = {
        addr_number: number,
        addr_code: l.code,
        addr_firstname: l.firstname,
        addr_lastname: l.lastname,
        addr_other_indication: l.other,
        addr_name: l.name,
        addr_city: l.city,
        addr_factur_code: l.fcode,
        addr_factur_name: l.fname,
        addr_factur_other_indication: l.fother,
        addr_factur_city: l.fcity,
        addr_factur_number: factur_number,
        phone: l.phone
      };
      return obj;
    }
  }
};
</script>
<style lang="sass" scoped>
@import '~assets/profile'


.paiement-button
    width: 30% !important;
    margin-left: auto;
    display: block;

.error-msg
    color: $color2
    font-size: 1.3rem;


.error-cgv
  color: $color4;
</style>
