<template>
  <figure class="image">
    <img class="img" :style="'object-fit: ' + this.fit" :src="src" />
  </figure>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    src: {
      type: String,
      required: true
    },
    fit: {
      type: String,
      default: "cover"
    }
  }
};
</script>
