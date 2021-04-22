<template>
  <div>
    <p class="p">
      <label>MOT DE PASSE</label
      ><input
        type="password"
        :class="{ password: true, invalid: invalidPsw }"
        v-model="password"
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

    <p>
      <label>CONFIRMER LE MOT DE PASSE</label
      ><input
        :class="{ invalid: invalidConfirmation }"
        type="password"
        v-model="passwordConfirmation"
      />
      <label v-if="formSend && invalidConfirmation"
        >Le mot de passe ne correspond pas</label
      >
    </p>
  </div>
</template>
<script>
export default {
  props: {
    formSend: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      password: "",
      passwordConfirmation: "",
      active: false
    };
  },
  methods: {
    get() {
      var passwordValidation = this.passwordValidation;
      if (passwordValidation) {
        return this.password;
      } else {
        return { error: "invalid password" };
      }
    }
  },

  computed: {
    char8() {
      return /.{8,}/.test(this.password);
    },
    maj() {
      return /[A-Z]/.test(this.password);
    },
    number() {
      return /[0-9]/.test(this.password);
    },
    charSpe() {
      return /[<>()\-ù&à#§!~&=°|%^£¤$\[\]\\.,`;*:\s@"]/.test(this.password);
    },
    invalidConfirmation() {
      if (!this.passwordConfirmation && !this.formSend) return false;

      return !(this.password == this.passwordConfirmation);
    },
    passwordValidation() {
      return (
        this.char8 &&
        this.maj &&
        this.number &&
        this.charSpe &&
        this.password == this.passwordConfirmation
      );
    },
    invalidPsw() {
      if (!this.password && !this.formSend) return false;
      return !(this.char8 && this.maj && this.number && this.charSpe);
    }
  }
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
  background-color: white !important;

.active
  background-color: $color1
  border-color: $color1
  color: $color1 !important

.activeLi
  color: $color1

li
  color: $color4

.hidden
  display: none;

.invalid
  border: 2px solid $color4;
  color: $color4;
</style>
