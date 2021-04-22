<template>
  <div class="image mb-2 ratio-20">
    <img class="img" :src="src" />
  </div>
</template>
<script>
export default {
  props: {
    src: {},
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="sass" scoped>
@import '~/assets/main.sass'

h2
  position: absolute
  background-color: #fffb
  color: $primary
  z-index: 10
</style>
