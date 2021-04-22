<template>
  <div
    @mouseover="placeholderSet"
    @mouseleave="placeholderRemove"
    class="is-size-5 has-background-white"
  >
    <label v-if="send" class="width-35p" />
    <input
      v-model="nameMail"
      class="text-right is-size-5"
      ref="emailFirst"
      @keydown="key"
      type="text"
      :placeholder="placeholderMail"
    />
    <label class="p-1" :style="aroStyle">@</label>
    <input
      v-model="nameDomain"
      class="is-size-5"
      ref="email"
      @keydown="keydownMail"
      :placeholder="placeholderDomain"
      type="text"
    />
    <label v-show="send" class="send-btn width-35p" @click="requestNewsletter">
      <icon class="icon" :icon="['fas', 'paper-plane']" />
    </label>
  </div>
</template>
<script>
export default {
  data() {
    return {
      aro: false,
      nameMail: "",
      nameDomain: "",
      placeholderMail: "",
      placeholderDomain: "",
    };
  },
  methods: {
    placeholderSet() {
      this.placeholderMail = "exemple";
      this.placeholderDomain = "email.fr";
    },
    placeholderRemove() {
      this.placeholderMail = "";
      this.placeholderDomain = "";
    },
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
    requestNewsletter() {
      this.$axios
        .post("/api/newsletter/post", {
          email: this.nameMail + "@" + this.nameDomain,
        })
        .then((r) => {
          this.nameMail = "";
          this.nameDomain = "";
          this.aro = false;
        });
    },
  },
  computed: {
    aroStyle() {
      return "color: " + (this.aro ? "rgb(118, 0, 47)" : "grey");
    },
    send() {
      var emailFormatConform = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/gm.exec(
        this.nameMail + "@" + this.nameDomain
      );

      return emailFormatConform;
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

input
  border: none
  flex: 1
  min-width: 0
  font-family: "GrotesqueLight"
  color: $color2

label
  color: $color2
  font-family: "GrotesqueLight"

.send-btn
  background-color: $color1
  padding: 0 8px
  padding-left: 6px
  padding-top: 0.25rem
  padding-bottom: 0.25rem
  color: white !important
  cursor: pointer

.send-btn:hover
  background-color: $color4

.send-btn svg
  color: white !important

.width-35p
  width: 35px
</style>
