<template>
  <List class="list" @select="$emit('select', $event)" :items="items">
    <template v-slot:default="namespace">
      <div :class="{ selected: namespace.item.active, listItem: true }">
        {{ namespace.item.name }}
      </div>
    </template>
  </List>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
</script>
<style lang="sass" scoped>

.selected
    color: white
    background-color: black

.listItem
    cursor: pointer

.list
  font-size: 1.3rem
  max-height: 80vh;
  overflow: auto;
</style>
