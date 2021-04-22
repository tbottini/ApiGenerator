<template>
  <label
    class="relative inline-block bg-white nowrap"
  >
    <ToggleButtonState v-model="listOptionShow"
      ><icon :icon="['fas', 'list']"
    /></ToggleButtonState>
    <ol @click.prevent class="modal-options" v-show="!listOptionShow">
      <li
        :class="classLi(o)"
        @click="active(o, i)"
        v-for="(o, i) in opt"
        :key="i"
      >
        {{ o.namePrint }}
      </li>
    </ol>
  </label>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      opt: this.list,
      listOptionShow: true
    };
  },
  methods: {
    classLi(li) {
      return {
        activeList: li.active
      };
    },
    active(list, index) {
      list.active = !list.active;
      this.$emit("updateList", list.active, index);
    }
  }
};
</script>
<style scoped>
.modal-options {
  position: absolute;
  border: 2px solid black;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 0;
  border-radius: 5px;
  background-color: white;
  z-index: 10;
}

.activeList {
  color: white;
  background-color: black;
}

.modal-options > * {
  cursor: pointer;
  list-style: none;
  padding: 7px;
}

.bg-white 
{
  background-color: white;
}

.relative
{
  position: relative;
}

.inline-block
{
  display: inline-block
}

.nowrap
{
  white-space: nowrap;
}
</style>
