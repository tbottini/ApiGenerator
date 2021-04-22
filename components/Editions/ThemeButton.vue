<template>
  <button :title="title" :class="'theme-button theme-button-' + type">
    <slot></slot>
  </button>
</template>
<script>
export default {
  props: {
    title: {
      required: false,
    },
    type: {
      default: "primary",
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen.sass
@import ~/assets/main.sass

.theme-button
  border: none
  width: 100%
  padding-bottom: 10px
  padding-top: 10px
  text-align: center
  cursor: pointer

.theme-button:hover
  color: $color3

.theme-button-primary
  background-color: $button-bg-color
  color: $button-color
  font-family: $button-font

.theme-button-primary:hovers
  font-family: $fontBold

.theme-button-primary::after
  content: attr(title)
  display: block
  visibility: hidden
  height: 0px
  overflow: hidden
  font-family: $fontBold

.theme-button-secondary
  background-color: $secondaryLight
  color: white
.theme-button-secondary:hover
  color: $primary

.button:focus
</style>
