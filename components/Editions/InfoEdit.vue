<template>
  <div>
    <PersonnalInformation
      :showMdp="false"
      ref="pers"
      :persoInfo="form.persoInfo"
    />
    <LivraisonInformation ref="liv" :livInfo="form.livInfo" />
    <div class="w-30">
      <ThemeButton class="button-register button4 bold" @click.native="get"
        >ENREGISTRER</ThemeButton
      >
      <p class="color-2">{{ error }}</p>
    </div>
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler";

export default {
  props: {
    user: {},
  },
  data() {
    return {
      error: "",
      form: {
        persoInfo: {
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          email: this.user.email,
          password: "",
          confirmationPassword: "",
          newsletter: this.user.follow_newsletter,
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
          fcity: this.user.addr_factur_city,
        },
      },
    };
  },
  methods: {
    get() {
      var persoInfo = this.$refs.pers.get();
      var livInfo = this.$refs.liv.get();

      var diffPerso = this.compareObject(this.form.persoInfo, persoInfo);
      var diffLiv = this.compareObject(this.form.livInfo, livInfo);

      var modelObjectApi = this.purify(this.translate(diffPerso, diffLiv));
      console.log(modelObjectApi);

      apiHandler.editObject("users", modelObjectApi).then((m) => {
        m.forEach((r) => {
          console.log(r.data);
          if (r.data.code == 1) this.error = "L'email existe déjà";
        });
        this.$store.dispatch("self");
      });
    },
    compareObject(srcBase, srcNew) {
      var entrGet = Object.entries(srcNew);
      var entrBase = Object.entries(srcBase);
      var diff = {};

      entrGet.forEach((e, i) => {
        if (e[1] != entrBase[i][1]) diff[e[0]] = e[1];
      });
      return diff;
    },

    translate(p, l) {
      var obj = {
        email: p.email,
        firstname: p.firstname,
        lastname: p.lastname,
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
    purify(obj) {
      Object.keys(obj).forEach((key) =>
        obj[key] === undefined ? delete obj[key] : {}
      );
      return obj;
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~assets/lichen
.button-register:hover
  background-color: $color4 !important
</style>
