<template>
  <div class="register">
    <PersonnalInformation
      :formSend="formSend"
      ref="pers"
      :persoInfo="form.persoInfo"
    />
    <LivraisonInformation ref="liv" :livInfo="form.livInfo" />
    <hr />
    <div>
      <input
        type="checkbox"
        class="inline"
        style="display: inline"
        :value="true"
        v-model="cguAcceptation"
      />
      <p
        class="tiny-text inline color-1"
        :class="{ 'error-cgu': this.formSend && !this.cguAcceptation }"
        style="display: inline"
      >
        J'ai lu et j'accepte
        <a href="/cgu.html">les conditions générales d'utilisation.</a>
      </p>
    </div>
    <div class="w-30 button-register">
      <div class="error">{{ error }}</div>

      <ThemeButton
        @click.native="push"
        class="button-register bold button3 button-hover"
        >INSCRIPTION</ThemeButton
      >
    </div>
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler";

export default {
  data() {
    console.log(this.$router);
    return {
      formSend: false,
      error: "",
      cguAcceptation: false,
      form: {
        persoInfo: {
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmationPassword: "",
          newsletter: true,
        },
        livInfo: {
          firstnameLiv: "",
          lastnameLiv: "",
          addrVoie: "",
          addrNumber: "",
          addrOther: "",
          addrCodePostal: "",
          addrCity: "",
          addrPhone: "",
          addrFVoie: "",
          addrFNumber: "",
          addrFOther: "",
          addrFCodePostal: "",
          addrFCity: "",
        },
      },
    };
  },
  methods: {
    validate() {
      var { mailValidation, passwordValidation } = this.$refs.pers.validation();

      if (!this.cguAcceptation) {
        this.error =
          "Vous devez accepter les conditions générales d'utilisation";
        return false;
      } else this.error = "";
      console.log(mailValidation);
      if (!mailValidation) this.error = "Votre email est mal formaté";
      else if (!passwordValidation) this.error = "Erreur avec le mot de passe";
      return mailValidation && passwordValidation;
    },
    push() {
      this.formSend = true;
      const validForm = this.validate();
      console.log("CHECK FORM VALID", validForm);
      if (!validForm) return;

      var liv = this.$refs.liv.get();
      console.log("liv", liv);
      var pers = this.$refs.pers.get();

      var obj = this.translate(pers, liv);

      apiHandler.postForm("users/post", obj, true).then((r) => {
        var user = r.data;
        console.log("USER", user);
        if (user.error) {
          if (user.code == 1) this.error = "l'email choisit est déjà utilisé";
        } else {
          apiHandler
            .postForm(
              "users/login",
              {
                email: pers.email,
                password: pers.password,
              },
              true
            )
            .then((r) => {
              console.log("RESULT", r.data);
              r = r.data;
              if (!r.error) {
                console.log("login");
                this.$store.commit("login", r);
                this.$router.push("/");
              }
            });
        }
      });
    },
    translate(p, l) {
      var obj = {
        email: p.email,
        firstname: p.firstname,
        lastname: p.lastname,
        password: p.password,
        follow_newsletter: p.newsletter,
        addr_number: l.number,
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
        addr_factur_number: l.fnumber,
        phone: l.phone,
      };
      return obj;
    },
  },
};
</script>
<style lang="sass" scoped>
@import '~/assets/lichen'
.register
  width: 100%
  margin: 0 auto

.error
  font-size: 1.3rem
  color: $color1
  font-family: $fontBold

.error-cgu
  color: $color4

.button-register
  margin-left: auto
</style>
