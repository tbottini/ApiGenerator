<template>
  <nav :style="nav">
    <div class="nav" v-if="activePanel" id="panel" :style="panel" ref="panel">
      <Button v-if="$mq == 'mobile'" @click.native="$emit('change', false)"
        >X</Button
      >
      <nuxt-link class="pad-20" :to="home">
        <slot></slot>
      </nuxt-link>
      <ul>
        <li
          :class="$mq == 'desktop' ? 'li-desk' : 'li-mobile'"
          v-for="(direction, index) in dir"
          :key="index"
        >
          <nuxt-link
            class="block"
            :to="direction.path"
            @click.native="setIndex(index)"
          >
            <p
              class="menu-element"
              :class="`dir dir-${mq} ${
                indexMenuSelected == index ? 'menu-element-selected' : ''
              }`"
            >
              {{ capitalize(direction.name) }}
            </p></nuxt-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  model: {
    prop: "active",
    event: "change",
  },
  props: {
    dir: {
      type: Array,
      required: true,
    },
    home: {
      type: String,
      default: "/",
    },
    width: {
      type: String,
      default: "25%",
    },
    minWidth: {
      type: String,
      default: "230px",
    },
    maxWidth: {
      type: String,
      default: "300px",
    },
    paddingtop: {
      type: String,
      default: "0",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    activePanel() {
      return this.$mq == "desktop" || (this.$mq == "mobile" && this.active);
    },
    nav() {
      if (this.$mq == "desktop")
        return {
          width: this.width,
          "min-width": this.minWidth,
          "max-width": this.maxWidth,
          "flex-shrink": "0",
        };
      else return {};
    },
    panel() {
      if (this.$mq == "desktop")
        return {
          width: this.width,
          top: this.paddingtop,
          "min-width": this.minWidth,
          "max-width": this.maxWidth,
        };
      else
        return {
          width: "100%",
          overflow: "hidden",
          opacity: "1",
        };
    },
  },
  methods: {
    setIndex(index) {
      console.log(index);
      this.indexMenuSelected = index;
    },
    optionPress(url) {
      this.$router.push(url);
      if (this.$mq == "mobile") this.$emit("change", false);
    },
    capitalize(str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1);
    },
  },
  data() {
    return {
      indexMenuSelected: null,
    };
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/manage

*
  overflow: hidden

.nav
  text-align: right
  font-family: Segoe UI, Roboto !important

#panel
  position: fixed
  height: 100vh
  /*box-shadow: inset -7px 0 9px -7px rgba(0,0,0,0.7);*/
  border-right: 1px solid $color-primary
  background-color: #f4f4f2
  z-index: 4
  overflow-y: auto

ul
  padding-left: 0

h2
  color: white
  font-size: 2em
  margin: 0
  padding: 30px

li
  padding-top: 4px
  padding-bottom: 4px
  list-style: none
  text-decoration: none
  font-size: 1em
  cursor: pointer

.dir
  width: min-content
  margin: 0
  border-bottom: 1px solid transparent

  &:hover
    border-bottom: 1px solid $color-primary

  &-mobile
    margin: 0 auto

.li-mobile
  text-align: center
  padding-left: 0

.block
  display: block

.menu-element
  font-family: Segoe UI, Roboto !important
  font-weight: 500
  width: 100%
  color: $color-default
  text-align: left
  padding-left: 20px

.menu-element:hover

  font-weight: 600

.menu-element-selected, .menu-element-selected:hover
  background-color: white
  font-weight: 700
  color: $color-default !important
</style>
