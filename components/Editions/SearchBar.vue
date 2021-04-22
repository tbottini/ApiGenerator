<template>
  <div
    @keydown.enter="research"
    :class="{ searchBar: true, activeBar: searching }"
  >
    <input
      v-model="value"
      ref="barSearch"
      type="text"
      @keydown="onKeydown"
      :class="{ hidden: !searching, bar: true }"
    />
    <icon
      class="icon active"
      v-if="canResearch"
      :icon="['fas', 'search']"
      @click="research"
    />
    <icon
      class="icon"
      :icon="['fas', !searching ? 'search' : 'times']"
      @click="search"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      searching: false,
    };
  },
  methods: {
    search() {
      this.searching = !this.searching;
      this.$nextTick(() => this.$refs.barSearch.focus());
      this.value = "";
    },
    onKeydown() {},
    research() {
      if (this.canResearch) this.$router.push("/explorer/" + this.value);
      this.search();
    },
  },
  computed: {
    canResearch() {
      return this.value.length != 0;
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen
.searchBar
  display: flex
  flex: 1
  width: 50%
  height: 100%

.activeBar
  border-bottom: 1px solid black
.bar
  margin-right: 10px
  border: none

  font-size: 1.1rem
  background: none
  width: 100%

.bar:focus
  border: none

.icon
  width: 23px
  height: 23px
  margin: 0 5px
  cursor: pointer

.icon:hover
  color: $primary

.active
  color: $primary

.hidden
  visibility: hidden
</style>
