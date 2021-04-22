<template>
  <div>
    <h2 style="text-align: left; margin-bottom: 0">{{ nbBook }} Livres</h2>
    <h3>
      {{ p.total_price.toFixed(2) }}€ le {{ datePurchases(p.command_date) }}
    </h3>
    <h3 v-html="address(p)"></h3>
    <ul>
      <li v-for="(poem, i) in p.poems" :key="i">
        <nuxt-link :to="'/' + poem.slug"
          >{{ poem.quantity > 1 ? poem.quantity + " x " : "" }}
          {{ poem.title }} -
          {{
            poem.poet
              ? poem.poet.map((p) => p.firstname + " " + p.lastname).join(" ")
              : ""
          }}</nuxt-link
        >
      </li>
    </ul>
    <div class="w-30">
      <ThemeButton
        @click.native="shipping"
        class="button4 purchases-button bold w-30 mt-4"
        ><slot>EXPÉDIÉ</slot></ThemeButton
      >
    </div>
  </div>
</template>
<script>
import dateLib from "~/assets/dateLib";

export default {
  props: {
    p: {
      required: true,
    },
  },
  methods: {
    datePurchases(date) {
      const d = new Date(date);

      return (
        d.getDate() +
        " " +
        dateLib.tradMonth(d.getMonth()) +
        " " +
        d.getFullYear()
      );
    },
    address(poem) {
      const lines = [
        [poem.addr_lastname, poem.addr_firstname],
        [poem.addr_number, poem.addr_name],
        [poem.addr_code, poem.addr_city],
        [poem.addr_other_indication],
        [poem.addr_factur_number, poem.addr_factur_name],
        [poem.addr_factur_code, poem.addr_factur_city],
        [poem.addr_factur_other_indication],
      ]
        .filter((l) => {
          return l.filter((sl) => sl).length;
        })
        .map((l) => {
          return l.join(" ");
        })
        .join("<br>");

      return lines;
    },
    shipping() {
      this.$emit("shipping");
    },
  },
  computed: {
    nbBook() {
      var n = 0;
      this.p.poems.forEach((book) => (n += book.quantity));
      return n;
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen

.purchases-button
  height: 2.2rem
.purchases-button:hover
  background-color: $color4 !important
</style>
