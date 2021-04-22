<template>
  <div>
    <label class="input-nb" @click="$emit('change', number - 1)">-</label>
    <label class="input-print">{{ number }}</label>
    <label class="input-nb more" @click="$emit('change', number + 1)">+</label>
  </div>
</template>
<script>
export default {
  model: {
    prop: "number",
    event: "change",
  },
  props: {
    number: {
      type: Number,
      required: true,
    },
  },
};
</script>
<style lang="sass" scoped>
@import '~/assets/lichen'
label
  font-size: 1.3rem

.input-nb
  cursor: pointer
  font-size: 2.2rem

.input-nb:hover
  color: $color4

.more
  font-size: 1.5rem
.input-print
  padding: 0 1rem
  font-family: $font
</style>
