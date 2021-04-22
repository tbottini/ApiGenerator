<template>
  <div>
    <h3 class="mt-5">3. CHOISIR VOTRE MODE DE PAIEMENT</h3>
    <p>
      <label>CARTE BANCAIRE</label>
    </p>
    <div class="w-50" style="font-size: 1.3rem; ">
      <div id="card-element"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  mounted() {
    console.log(this.$store.getters.panier());
    var panierId = this.$store.getters.panier().map(a => {
      return { id: a.id, quantity: a.qty };
    });

    console.log(panierId);
    this.$axios
      .post("/api/purchases/calculation", {
        cart: panierId
      })
      .then(res => {
        console.log("###dataa", res.data);
        if (res.data.error) return;

        var style = {
          base: {
            color: "rgb(118, 0, 47)",
            fontFamily: "Roboto, sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "18px",
            iconColor: "rgb(205, 82, 74)",
            "::placeholder": {
              color: "rgb(118, 0, 47)"
            }
          },

          invalid: {
            fontFamily: "Roboto, sans-serif",
            color: "rgb(255, 136, 55)",
            iconColor: "#fa755a"
          }
        };

        this.clientSecret = res.data;
        var elements = this.$stripe.elements();
        var card = elements.create("card", { style: style });
        this.card = card;

        card.mount("#card-element");
      });
  },
  data() {
    return {
      clientSecret: null,
      sellWorking: false,
      error: "",
      card: null
    };
  },
  methods: {
    get() {
      return {};
    },
    async submit() {
      console.log("client secret", this.clientSecret);
      if (!this.clientSecret || this.sellWorking) return;
      this.sellWorking = true;

      var res = await this.$stripe.confirmCardPayment(
        this.clientSecret.clientSecret,
        {
          payment_method: {
            card: this.card
          }
        }
      );

      if (res.error) {
        this.error = res.error.message;
        var error = res.error.message;

        this.sellWorking = false;

        console.log(error);

        return { error: error };
      } else {
        this.$emit("confirm");
        return { msg: confirm };
      }
    }
  }
};
</script>
<style lang="sass" scoped>
@import '~/assets/profile'
</style>
