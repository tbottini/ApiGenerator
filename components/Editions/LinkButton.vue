<template>
  <a :href="path" target="_blank"
    ><ThemeButton class="button1"><slot></slot></ThemeButton
  ></a>
</template>
<script>
export default {
  props: {
    path: {
      type: String,
      required: true
    }
  }
};
</script>
<style lang="sass" scoped>
a
    width: 100%

button
    font-size: 1.1rem
</style>
