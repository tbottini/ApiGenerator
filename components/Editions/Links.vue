<template>
  <div class="links" v-if="links">
    <SearchBar />
    <div class="ml-1 mr-1">
      <nuxt-link to="/profil">
        <icon class="icon" :icon="['fas', 'user']" />
      </nuxt-link>
    </div>
    <nuxt-link v-if="links.shop" :to="links.shop"
      ><div style="position: relative; cursor: pointer">
        <client-only>
          <label
            style="cursor: pointer"
            v-show="shopCartItems > 0"
            class="shopCartItemsLength"
            >{{ shopCartItems }}</label
          >
        </client-only>
        <icon class="icon" :icon="['fas', 'shopping-cart']" /></div
    ></nuxt-link>
  </div>
</template>
<script>
export default {
  props: {
    links: {
      required: true,
    },
  },
  computed: {
    shopCartItems() {
      return this.$store.getters.qty();
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen

.links
  display: flex
  height: 100%
  width: 50%

.links *
  width: 23px
  height: 23px

a
  color: black

.icon:hover
  color: $color1

.shopCartItemsLength
  position: absolute
  top: -7px
  right: -12px
  color: white
  background-color: $color4
  font-family: $fontBold
  border-radius: 100%
  text-align: center
  font-size: 0.8rem
  padding-top: 3px
</style>
