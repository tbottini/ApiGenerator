<template>
  <div>
    <ul>
      <li @click="select(i)" v-for="(item, i) in items" :key="i">
        <slot v-bind:item="item">{{ item }}</slot>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    select(index) {
      this.$emit("select", index);
    }
  }
};
</script>
