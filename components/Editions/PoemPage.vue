<template>
  <div>
    <client-only>
      <DoublePanel
        class="mt-6"
        spacerValue="0.1"
        titleLayout="Un bateau nommé poésie"
      >
        <template v-slot:left>
          <div>
            <img
              style="width: 100%"
              :src="'/api/_ipx/static/image/' + poem.illustration"
            />
            <label class="color-1">{{ poem.illcredit }}</label>
            <div class="text-primary">
              <label class="regular" v-if="catalog"
                >Collection :
                <nuxt-link
                  class="catalog regular"
                  :to="'/collections/' + catalog.slug"
                  >{{ catalog.title }}</nuxt-link
                ><br
              /></label>
              <label class="regular"
                >Pages : {{ poem.pages }}
                <br />
                Prix : {{ poem.price }}€<br />
                ISBN : {{ poem.isbn }}<br
              /></label>
              <br />
              <label v-if="poem.epub"
                >Également disponible au format numérique (epub et PDF)<br
              /></label>
            </div>
            <div class="actions">
              <a v-if="poem.linkPresse" :href="poem.linkPresse"
                ><ThemeButton class="button3 poem-button bold"
                  >REVUE DE PRESSE</ThemeButton
                ></a
              ><a v-if="poem.linkExtrait" :href="poem.linkExtrait">
                <ThemeButton class="button3 poem-button bold"
                  >LIRE UN EXTRAIT</ThemeButton
                ></a
              >
              <ThemeButton
                class="button1 poem-button bold"
                title="AJOUTER AU PANIER"
                v-if="poem.sell_available"
                @click.native="addPanier"
                >AJOUTER AU PANIER
                <icon
                  v-show="bought"
                  :icon="['fas', 'check']"
                  style="margin-bottom: 0; margin-left: 1rem"
                />
              </ThemeButton>
              <div>
                <Share :route="$route.params.post" />
              </div>
            </div>
          </div>
        </template>
        <template v-slot:right>
          <div>
            <h1>{{ poem.title }}</h1>
            <h3>{{ poem.subtitle }}</h3>
            <h2>
              <template v-for="(auth, i) in author">
                <nuxt-link :key="i" :to="auth.slug || '/'">
                  {{ auth.firstname }} {{ auth.lastname }}</nuxt-link
                >
                <template v-if="i + 1 != author.length"> & </template>
              </template>
            </h2>
            <h3>
              <template v-if="traductor.length">Traduit par :</template>
              <template v-for="(trad, i) in traductor">
                <nuxt-link style="color: grey" :key="i" :to="trad.slug || '/'">
                  {{ trad.firstname }} {{ trad.lastname }}</nuxt-link
                >
                <template v-if="i + 1 != traductor.length"> & </template>
              </template>
            </h3>
            <br />
            <strong>En librairie le {{ date }}</strong>
            <br /><br />
            <p v-html="poem.description"><br /><br /></p>
          </div>
        </template>
      </DoublePanel>
      <BackButton to="/" class="mt-6"> RETOUR AUX LIVRES </BackButton>
    </client-only>
  </div>
</template>
<script>
import dateLib from "~/assets/dateLib";

export default {
  props: {
    poem: {
      type: Object,
      required: true,
    },
  },
  data() {
    var found;
    this.$axios.get("/api/poem/" + this.poem.id).then((res) => {
      this.author = res.data.poet;
      this.traductor = res.data.traductor;

      found = this.$store.getters.panier().find((p) => {
        return p.id == res.data.id;
      });
      this.bought = !!found;
    });

    this.$axios
      .get("/api/collection/" + this.poem.id_collection)
      .then((res) => {
        this.catalog = res.data;

        if (!this.poem.weight)
          this.poem.weight = this.catalog.weight_default || 0.2;
      });

    return {
      bought: found,
      author: [],
      traductor: [],
      catalog: null,
    };
  },
  computed: {
    date() {
      if (!this.poem || !this.poem.publication) return "";
      return dateLib.ddMMyyyy(this.poem.publication);
    },
  },
  methods: {
    addPanier() {
      this.$store.commit("panierAdd", { poem: this.poem });
      this.bought = true;
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen.sass

.text-primary
  color: $color1
  font-family: $fontLight !important

.actions *
  margin-bottom: 20px

.actions
  width: 80%
  margin-top: 20px

.catalog, a
  color: $color1
.catalog:hover, a:hover
  color: black

h1
  margin-top: -1rem

h2
  text-align: left

h3
  color: grey
  font-style: italic

.poem-button
  height: 2.3rem

.poem-button:hover
  background-color: $color4 !important
</style>
