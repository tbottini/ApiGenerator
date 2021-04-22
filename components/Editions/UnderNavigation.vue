<template>
  <div class="mb-4 flex under-navigation">
    <label v-if="!link" class="subtitle is-size-4 mb-0 font2 color-1">
      {{ subtitle }}
    </label>
    <nuxt-link :to="link" v-else class="subtitle is-size-4 mb-0 font2 color-1">
      {{ subtitle }}
    </nuxt-link>
    <Links style="padding-top: 0.4rem" :links="links" />
  </div>
</template>
<script>
export default {
  props: {
    subtitle: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      default: "",
    },
    links: {
      required: false,
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="sass" scoped>
@import '~/assets/main.sass'
@import '~/assets/lichen'

.subtitle
  font-weight: 200

.flex
  display: flex
  justify-content: space-between

.under-navigation
  padding-top: 0.2rem
  align-items: start
  height: 2.3rem
  margin-bottom: 1rem
</style>
