<template>
  <p class="choosen">
    <label v-for="(elem, i) in elements" :key="i">
      {{ elem.name }}
      <icon
        @click="$emit('untag', elem)"
        class="icon-delete"
        :icon="['fas', 'times']"
      />
    </label>
  </p>
</template>
<script>
export default {
  props: {
    elements: {
      required: true
    }
  }
};
</script>
<style lang="sass" scoped>
.icon-delete
  width: 18px;
  height: 18px
  border-radius: 100%
  border: 1px solid black
  padding: 3px
  cursor: pointer;

.icon-delete:hover
  color:  #FFF5E6
  background-color: black

.choosen
  margin-bottom: 1rem



.choosen *
  background-color:  #FFF5E6
  margin: 2px
  font-size: 1.2rem
</style>
