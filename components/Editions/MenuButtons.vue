<template>
  <div class="menu">
    <nuxt-link :to="first.path"
      ><ThemeButton class="btns button4">{{
        first.name
      }}</ThemeButton></nuxt-link
    >
    <nuxt-link :to="second.path"
      ><ThemeButton class="btns button2">{{
        second.name
      }}</ThemeButton></nuxt-link
    >
    <nuxt-link :to="third.path"
      ><ThemeButton class="btns button3">{{ third.name }}</ThemeButton>
    </nuxt-link>
  </div>
</template>
<script>
export default {
  props: {
    first: {},
    second: {},
    third: {},
  },
};
</script>
<style lang="sass" scoped>
@import '~/assets/lichen.sass'

.menu
  width: 100%
  padding-left: 5%
  padding-right: 5%
  align-self: center

.menu a
  display: block

.menu a:not(:first-child)
  margin-top: 3%

.menu a > *

  font-size: 3rem
  font-weight: 200
  padding-top: 2% !important
  padding-bottom: 2% !important
</style>
