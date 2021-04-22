<template>
  <div>
    <h3>1. VOS INFORMATIONS PERSONNELLES</h3>
    <p>
      <label>PRÉNOM</label><input v-model="info.lastname" /><label class="ml-5"
        >NOM</label
      ><input v-model="info.firstname" />
    </p>
    <p>
      <label>E-MAIL</label
      ><Mail
        :verifActive="true"
        :formSend="formSend"
        ref="mail"
        :mail="info.email"
        class="mMail"
        @change="setMail"
      />
    </p>
    <p class="p" v-if="showMdp">
      <label>MOT DE PASSE</label
      ><input
        type="password"
        :class="{ password: true, invalid: invalidPsw }"
        v-model="info.password"
        @focusin="active = true"
        @focusout="active = false"
      /><label v-if="formSend && invalidPsw"
        >Votre mot de passe est mal formaté</label
      >
      <label :class="{ hidden: !active }"
        ><br />doit contenir:
        <ul>
          <li :class="{ activeLi: char8 }">
            <div :class="{ point: true, active: char8 }" />
            au moins 8 caractères
          </li>
          <li :class="{ activeLi: maj }">
            <div :class="{ point: true, active: maj }" />
            une majuscule
          </li>
          <li :class="{ activeLi: number }">
            <div :class="{ point: true, active: number }" />
            un nombre
          </li>
          <li :class="{ activeLi: charSpe }">
            <div :class="{ point: true, active: charSpe }" />
            un caractère spécial
          </li>
        </ul>
      </label>
    </p>

    <p v-if="showMdp">
      <label>CONFIRMER LE MOT DE PASSE</label
      ><input
        :class="{ invalid: invalidConfirmation }"
        type="password"
        v-model="info.confirmationPassword"
      />
      <label v-if="formSend && invalidConfirmation"
        >Le mot de passe ne correspond pas</label
      >
    </p>
    <br />
    <input
      type="checkbox"
      class="inline"
      :value="true"
      v-model="info.newsletter"
    />
    <p class="tiny-text inline color-1">
      J’autorise les Éditions Bruno Doucey à utiliser mon adresse mail pour
      m’envoyer des informations concernant leurs actualités
    </p>
    <br />
  </div>
</template>
<script>
export default {
  props: {
    showMdp: {
      default: true,
    },
    persoInfo: {},
    formSend: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { info: { ...this.persoInfo }, active: false };
  },
  methods: {
    get() {
      //if (!this.char8 || !this.maj || !this.number || !this.charSpe)
      //  return null;
      return this.info;
    },
    setMail(m) {
      this.info.email = m;
    },
    validation() {
      var mailValidation = this.$refs.mail.validation();
      var passwordValidation = this.passwordValidation;
      return { mailValidation, passwordValidation };
    },
  },
  computed: {
    char8() {
      return /.{8,}/.test(this.info.password);
    },
    maj() {
      return /[A-Z]/.test(this.info.password);
    },
    number() {
      return /[0-9]/.test(this.info.password);
    },
    charSpe() {
      return /[<>()\-ù&à#§!~&=°|%^£¤$\[\]\\.,`;*:\s@"]/.test(
        this.info.password
      );
    },
    invalidConfirmation() {
      if (!this.info.confirmationPassword && !this.formSend) return false;

      return !(this.info.password == this.info.confirmationPassword);
    },
    passwordValidation() {
      return (
        this.char8 &&
        this.maj &&
        this.number &&
        this.charSpe &&
        this.info.password == this.info.confirmationPassword
      );
    },
    invalidPsw() {
      if (!this.info.password && !this.formSend) return false;
      return !(this.char8 && this.maj && this.number && this.charSpe);
    },
  },
};
</script>
<style lang="sass" scoped>
@import '~assets/profile.sass'

.point
  width: 0.6rem
  height: 0.6rem
  border-radius: 100%
  display: inline-block
  margin: 0 0.5rem
  border: 2px solid $color4

input
  background-color: white !important

.active
  background-color: $color1
  border-color: $color1
  color: $color1 !important

.activeLi
  color: $color1

li
  color: $color4

.hidden
  display: none

.invalid
  border: 2px solid $color4
  color: $color4
</style>
