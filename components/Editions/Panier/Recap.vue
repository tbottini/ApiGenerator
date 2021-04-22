<template>
  <div>
    <client-only>
      <template v-if="shopCart.length">
        <div class="shopcart regular font-size-medium">
          <p class="regular" style="margin-bottom: -1px"></p>
          <p class="regular padding-1 color-4" style="margin-bottom: -1px">
            TITRE
          </p>
          <p
            style="margin-bottom: -1px"
            class="regular border-hori padding-1 color-4 font-size-medium align-center"
          >
            QUANTITÉ
          </p>
          <p
            class="regular padding-1 color-4 font-size-medium align-center"
            style="margin-bottom: -1px"
          >
            PRIX
          </p>
          <template class="purchase" v-for="(poem, i) in shopCart">
            <div :key="i + '-1'" class="wrap-article">
              <figure class="image article">
                <img
                  class="img"
                  style="object-fit: contain"
                  :src="'/api/_ipx/static/image/' + poem.illustration"
                />
              </figure>
            </div>
            <div class="wrap-text" :key="i + '-2'">
              <p class="title-p font-size-medium">
                <nuxt-link :to="poem.slug">{{ poem.title }}</nuxt-link>
              </p>
            </div>

            <div class="wrap-text inputqty" :key="i + '-12'">
              <p style="width: 100%; text-align: center">
                {{ poem.qty }}
              </p>
            </div>

            <div class="wrap-text" :key="i + '-4'">
              <p class="price">{{ poem.price * poem.qty }} €</p>
            </div>
          </template>
          <p></p>
          <p
            class="regular font-size-medium align-right"
            style="padding-top: 10px; padding-bottom: 10px"
          >
            FRAIS DE PORT TTC:
          </p>
          <p />
          <p
            class="regular font-size-medium align-center"
            style="padding-top: 10px; padding-bottom: 10px"
          >
            {{ transportPrice }} €
          </p>
          <p />
          <p
            class="regular font-size-medium align-right"
            style="padding-top: 10px; padding-bottom: 10px"
          >
            TOTAL TTC:
          </p>
          <p />
          <p
            class="regular font-size-medium align-center"
            style="padding-top: 10px; padding-bottom: 10px"
          >
            {{ (totalPrice + transportPrice).toFixed(2) }} €
          </p>
          <p />
          <div class="bg-3" />
        </div>
      </template>
    </client-only>
  </div>
</template>
<script>
export default {
  props: {
    shopCart: {},
  },
  watch: {},
  computed: {
    totalPrice() {
      var p = 0;
      if (!this.shopCart) return 0;
      this.shopCart.forEach((poem) => {
        p += poem.price * poem.qty;
      });
      return p;
    },
    totalWeight() {
      var w = 0;
      if (!this.shopCart) return w;
      this.shopCart.forEach((p) => {
        console.log(p);
        w += p.weight * p.qty;
      });
      return w;
    },
    transportPrice() {
      console.log(this.totalWeight);
      const w = this.totalWeight;

      if (this.totalPrice >= 100) return 0;

      if (w < 0.02) return 1.08;
      else if (w < 0.1) return 2.16;
      else if (w < 0.25) return 3.94;
      else if (w < 0.5) return 5.91;
      else return 8.64;
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/main.sass
@import ~/assets/lichen.sass

$c: #FF9D4C

.shopcart *
  background-color: #FFF8EF

.purchase
  display: flex
  flex-direction: row

.purchase > *
  flex: 1
  margin-bottom: 20px

.wrap-article
  padding: 8%

.article
  width: 100%
  padding-top: 130%

.inputqty
  text-align: center
  font-size: 1.3rem
  border: none
  border-left: 1px solid $c
  border-right: 1px solid $c
  min-width: 0

.delete-btn
  flex: 0.3

.price
  text-align: center
  width: 100%
  font-size: 1.3rem

.border-hori
  border-left: 1px solid $c
  border-right: 1px solid $c

.shopcart
  margin: 0 6%
  display: grid
  grid-template-columns: 0.3fr 1.4fr 0.5fr 0.4fr
  grid-row-gap: 1px
  background-color: $c

.title-p, .price
  padding-left: 10px
  font-family: $font

.wrap-text
  position: relative
.wrap-text p
  position: absolute
  top: 34%

.paiement-button
  margin-top: 1rem
  background-color: $color4 !important
  color: $color2 !important
  font-family: $fontBold !important

.paiement-button:hover
  color: white !important

.panier-qty
  position: absolute
  top: 22%

.font-size-medium
  font-size: 1.2rem

.icon-trash:hover
  color: $color4
  cursor: pointer

.padding-1
  padding: 1rem
.align-center
  text-align: center
.align-left
  text-align: left
.align-right
  text-align: right

.bg-3
  background-color: $color3
</style>
