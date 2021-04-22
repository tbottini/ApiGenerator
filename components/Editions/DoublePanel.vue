<template>
  <div class="double-panel mt-6">
    <div id="left">
      <slot name="left"> </slot>
    </div>
    <div :style="spacer" />
    <div id="right">
      <slot name="right"> </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    titleLayout: {
      type: String,
      default: ""
    },
    linkLayout: {
      type: String,
      default: null
    },
    spacerValue: {
      default: 0.15
    }
  },
  data() {
    this.$store.commit("setLayout", {
      title: this.titleLayout,
      link: this.linkLayout
    });
    return {};
  },
  computed: {
    spacer() {
      return "flex: " + this.spacerValue;
    }
  }
};
</script>
<style lang="sass" scoped>

.double-panel
    display: flex

#left
    flex: 0.5

#left > div
    margin-left: auto;

#right
    flex: 1

#right > div
    width: 80%
</style>
