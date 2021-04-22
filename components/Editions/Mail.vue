<template>
  <label
    class="size-mail has-background-white bg-white"
    :class="{ invalid: invalidMail }"
  >
    <input
      v-model="nameMail"
      class="text-right size-mail"
      ref="emailFirst"
      @keydown="key"
      type="text"
    /><label class="aro" :style="aroStyle">@</label
    ><input
      v-model="nameDomain"
      class="size-mail"
      ref="email"
      @keydown="keydownMail"
      type="text"
    />
  </label>
</template>
<script>
export default {
  name: "mail",
  props: {
    mail: {},
    verifActive: {
      type: Boolean,
      default: false,
    },
    formSend: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const mailPart = this.mail?.split("@");

    return {
      aro: mailPart?.length > 1,
      nameMail: mailPart[0] || "",
      nameDomain: mailPart[1] || "",
    };
  },

  watch: {
    nameMail() {
      this.$emit("change", this.email());
    },
    nameDomain() {
      this.$emit("change", this.email());
    },
  },
  methods: {
    key(event) {
      if (event.key == "@") {
        event.preventDefault();
        this.aro = true;
        this.$refs.email.focus();
      }
    },
    keydownMail(event) {
      const BACKSPACE_KEYCODE = 8;

      if (!event.target.value.length && event.keyCode == BACKSPACE_KEYCODE) {
        this.$refs.emailFirst.focus();
        this.aro = false;
      }
    },
    inputStyle(ref) {
      ref.style.width = (ref.value.length + 1) * 8 + "px";
    },
    email() {
      return this.nameMail + "@" + this.nameDomain;
    },
    validation() {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.emailVar
      );
    },
  },
  computed: {
    emailVar() {
      if (!this.nameDomain && !this.nameMail) return null;
      return this.nameMail + "@" + this.nameDomain;
    },
    aroStyle() {
      return "color: " + (this.aro ? "rgb(118, 0, 47)" : "grey");
    },
    invalidMail() {
      console.log(this.formSend);
      if (!this.verifActive || !this.formSend) return false;
      return !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.emailVar
      );
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen
.text-right
  text-align: right

div
  display: flex
  width: 40%

input
  border: none
  flex: 1
  min-width: 0
  font-family: "GrotesqueLight"
  color: $color2
  border: 0.5px solid transparent
  padding: 0

input:focus
  color: $color1

label
  color: $color2
  font-family: "GrotesqueLight"

.aro
  padding-left: 0.2rem
  padding-right: 0.2rem
  background-color: white

.send-btn
  background-color: $primary
  padding: 0 8px
  padding-left: 6px
  padding-top: 0.25rem
  padding-bottom: 0.25rem
  color: white

.width-35p
  width: 35px

.size-mail
  font-size: 1.3rem

.invalid
  border: 2px solid $color4
  color: $color4

.invalid > *
  color: $color4 !important

.bg-white
  background-color: white
  padding: 0.1rem
</style>
