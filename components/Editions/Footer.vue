<template>
  <div class="pt-4 pb-6">
    <p class="pt-5 has-text-centered is-size-6">
      Pour ne rien manquer de nos actualités, abonnez-vous à notre lettre
      d'information mensuelle
    </p>
    <NewsLetter class="w-45 mb-3 div-center mt-1" />
    <div class="links" v-if="links">
      <a v-if="links.facebook" :href="links.facebook"
        ><icon class="icon" :icon="['fab', 'facebook']"
      /></a>
      <a v-if="links.instagram" :href="links.instagram"
        ><icon class="icon" :icon="['fab', 'instagram']"
      /></a>
      <a v-if="links.twitter" :href="links.twitter"
        ><icon class="icon" :icon="['fab', 'twitter']"
      /></a>
      <a v-if="links.soundcloud" :href="links.soundcloud"
        ><icon class="icon" :icon="['fab', 'soundcloud']"
      /></a>
      <a v-if="links.youtube" :href="links.youtube"
        ><icon class="icon" :icon="['fab', 'youtube']"
      /></a>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    links: {},
  },
};
</script>
<style lang="sass" scoped>
@import '~assets/lichen'
.icon
  width: 23px
  height: 23px
  margin: 2px

.icon:hover
  color: $color1

.links, p
  text-align: center
  width: 100%

.pb-7
  padding-bottom: 5rem

.pt-7
  padding-top: 5rem

hr
  background: black !important
  height: 1px
  width: 28%
  margin: 0 auto
  margin-bottom: 1.5rem
</style>
