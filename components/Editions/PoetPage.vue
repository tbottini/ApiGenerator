<template>
  <div>
    <DoublePanel class="mt-6" spacerValue="0.1" titleLayout="">
      <template v-slot:left>
        <div>
          <img
            style="width: 100%"
            :src="'/api/_ipx/static/image/' + poet.illustration"
          />
          <label class="color-1">{{ poet.illcredit }}</label>
          <h3>{{ poet.citation }}</h3>
          <div class="mt-5">
            <Share :route="$route.params.post" />
          </div>
        </div>
      </template>
      <template v-slot:right>
        <div>
          <h1 class="text-upper">{{ poet.firstname }} {{ poet.lastname }}</h1>
          <p v-html="poet.presentation"></p>
          <hr />
          <div class="image-list">
            <nuxt-link v-for="(src, i) in poems" :key="i" :to="src.link">
              <Img :src="src.src" fit="contain" />
            </nuxt-link>
          </div>
        </div>
      </template>
    </DoublePanel>
    <BackButton class="mt-5" :to="'/nos-auteurs' + categoryUrl">
      RETOUR AUX {{ returnText }}
    </BackButton>
  </div>
</template>
<script>
export default {
  props: {
    poet: {
      type: Object,
      required: true,
    },
  },
  data() {
    console.log(this.poet);
    console.log("POET PAGE");

    this.$axios.get("/api/poet/" + this.poet.id).then((r) => {
      this.poems = r.data.poem.map((poem) => {
        return {
          src: "/api/_ipx/static/image/" + poem.illustration,
          link: poem.slug || "/",
        };
      });
    });

    return {
      poems: [],
    };
  },
  computed: {
    returnText() {
      console.log(this.poet);
      if (this.poet.is_author) return "POÈTES";
      else if (this.poet.is_traductor) return "TRADUCTEURS";
      else if (this.poet.is_artist) return "ARTISTES";
      return "POÈTES";
    },
    categoryUrl() {
      const prefix = "?c=";
      if (this.poet.is_author) return prefix + "auteurs";
      else if (this.poet.is_traductor) return prefix + "traducteurs";
      else if (this.poet.is_artist) return prefix + "artistes";
      return "";
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen.sass

.text-primary
  color: $primary

h1
  margin-top: -1rem

.actions *
  margin-bottom: 20px

.actions
  width: 80%
  margin-top: 20px

.flex-row
  display: flex
  flex-direction: row
  flex-wrap: wrap

.image-list figure
  display: inline-block
  width: 194px
  height: 250px
  margin: 10px

.image-list figure:first-child
  margin-left: 0

.text-upper
  text-transform: uppercase

h3
  font-size: 1rem !important
  margin-top: 1rem
  font-style: italic
</style>
