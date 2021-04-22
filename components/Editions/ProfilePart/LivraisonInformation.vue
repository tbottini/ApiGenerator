<template>
  <div>
    <h3 class="mt-5">2. VOS INFORMATIONS DE LIVRAISON</h3>
    <p>
      <label>PRÉNOM</label
      ><input v-model="info.firstname" ref="firstname" /><label class="ml-5"
        >NOM</label
      ><input v-model="info.lastname" ref="lastname" />
    </p>
    <p class="mt-4"><label class="font-medium">ADRESSE</label></p>
    <p>
      <label>N°</label><input v-model="info.number" ref="number" />
      <label>NOM DE LA VOIE</label><input v-model="info.name" ref="name" />
    </p>
    <p><label>AUTRE INDICATION</label><input v-model="info.other" /></p>
    <p>
      <label>CODE POSTAL</label><input v-model="info.code" ref="code" /><label
        class="ml-5"
        >VILLE</label
      ><input v-model="info.city" ref="city" /> <label>TÉLÉPHONE</label
      ><input v-model="info.phone" ref="phone" />
    </p>
    <p class="mt-4">
      <label class="font-medium">ADRESSE DE FACTURATION</label>
      <label>(SI DIFFÉRENTE)</label>
    </p>
    <p>
      <label>N°</label><input v-model="info.fnumber" />
      <label>NOM DE LA VOIE</label><input v-model="info.fname" />
    </p>
    <p><label>AUTRE INDICATION</label><input v-model="info.fother" /></p>
    <p>
      <label>CODE POSTAL</label><input v-model="info.fcode" /><label
        class="ml-5"
        >VILLE</label
      ><input v-model="info.fcity" />
    </p>
    <p>
      Si vous ne résidez pas en France et que vous souhaitez passer commande,
      merci de nous contacter directement à
      <a href="mailto:contact@lichen.com">contact@lichen.com</a>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    livInfo: {},
  },
  data() {
    return { info: { ...this.livInfo } };
  },
  methods: {
    get() {
      return this.info;
    },
    validate() {
      var e = false;
      [
        "code",
        "firstname",
        "lastname",
        "name",
        "city",
        "phone",
        "number",
      ].forEach((attr) => {
        console.log("attr", attr);
        if (!this.info[attr]) {
          e = true;

          this.$refs[attr].classList.value += " error";
        }
      });

      return !e;
    },
  },
};
</script>
<style lang="sass" scoped>
@import '~assets/profile.sass'

.error
  background-color: white
  border: 2px solid $color4
</style>
