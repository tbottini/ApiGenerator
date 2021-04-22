<template>
  <div class="grid-discover">
    <div @click="show(i)" class="cell" v-for="(c, i) in cells" :key="i">
      <div class="white-filter"></div>
      <Img class="ratio-1" :src="'/api/_ipx/static/image/' + c.illustration" />
    </div>
    <div v-show="showModal" @click="showModal = false" class="modal">
      <div class="modal-body">
        <label>
          <icon
            class="absolute top-1 right-1 hov-color-1 size-1-5 hov-click"
            :icon="['fas', 'times']"
        /></label>
        <p class="discover-descr" v-html="descr"></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    this.$axios.get("/api/discover_mozaic?index=true").then((d) => {
      d = d.data;
      this.cells = d;
    });

    return {
      cells: [],
      showModal: false,
      descr: "",
    };
  },
  methods: {
    show(i) {
      console.log("show modal");
      this.showModal = true;
      this.descr = this.cells[i].description;
    },
    hide() {
      console.log("hide");
      this.showModal = false;
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/colors
@import ~/assets/lichen

h1, h2, h3
  color: $color2 !important

.cell
  cursor: pointer
  position: relative

.grid-discover
  display: grid
  grid-template-columns: repeat(3, 1fr)
  grid-gap: 1.6rem

.white-filter
  position: absolute
  width: 100%
  height: 100%
  background-color: white
  z-index: 1
  opacity: 0
.white-filter:hover
  opacity: 0.5

.modal
  display: block
  position: fixed
  margin: auto
  overflow-y: auto
  max-height: 80%
  max-width: 70%
  top: 3%

.modal-body
    //@extend .vertical-align-div
  background-color: #fffd

.discover-descr
  padding: 2rem
  font-size: 1.3rem

.top-1
  top: 1rem
.right-1
  right: 1rem
.absolute
  position: absolute

.size-1-5
  height: 1.5rem
  width: 1.5rem
</style>
