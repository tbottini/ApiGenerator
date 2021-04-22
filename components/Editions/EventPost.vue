<template>
  <div>
    <div class="illustration">
      <Img class="ratio-50" :src="event.illustration" />
    </div>
    <div class="pres">
      <h2>{{ event.title }}</h2>
      <h3>{{ date }}</h3>
      <p class="description" v-html="event.description" />
      <nuxt-link v-if="!globalLink" :to="event.path" class="has-text-centered"
        >LIRE LA SUITE</nuxt-link
      >
      <a :href="event.path" class="has-text-centered" v-else>LIRE LA SUITE</a>
    </div>
  </div>
</template>
<script>
import dateLib from "~/assets/dateLib";

export default {
  props: {
    event: {},
    globalLink: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    date() {
      if (!this.event || !this.event.publication) return "";
      return dateLib.ddMMyyyy(this.event.publication);
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen.sass

.illustration
  border: 0.5px solid $color1

.description
  height: 7rem
  overflow: hidden

.pres
  padding: 3% 6%
  padding-top: 1%
  border: 0.5px solid $color1
  border-top: 0px solid $color1
  background-color: white

a
  display: block
  text-align: center
  width: 100%
  font-size: 1rem
  text-transform: uppercase
  margin-top: 0.6rem
  color: $color1
h2
  text-transform: uppercase !important
  text-align: left
  font-size: 1.4rem !important
  margin-top: 0.2rem
  font-family: "Grotesque"

h3
  margin-bottom: 0.7rem
  font-size: 1.3rem !important

p
  font-size: 1.1rem

h1
  font-size: 1.2rem !important

a

a:hover
  font-family: "GrotesqueBold"
</style>
