<template>
  <nuxt-link class="center cursor" :to="to">
    <button class="back-button">
      <slot></slot>
    </button>
  </nuxt-link>
</template>
<script>
export default {
  props: {
    to: {
      required: true,
    },
  },
};
</script>
<style lang="sass" scoped>
@import '~/assets/lichen'

.center
    display: block
    text-align: center

.cursor
    cursor: pointer

.back-button
    cursor: pointer
    color: $color2
    margin: 0 auto
    padding: 7px 30px
    font-size: 1.2rem
    background-color: transparent
    border: 1px solid $color1

.back-button:hover
    background-color: $color1
    color: white
</style>