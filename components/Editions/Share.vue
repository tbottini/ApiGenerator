<template>
  <div class="links">
    <a target="_blank" :href="facebook"
      ><icon class="icon" :icon="['fab', 'facebook']"
    /></a>
    <a target="_blank" :href="twitter"
      ><icon class="icon" :icon="['fab', 'twitter']"
    /></a>
  </div>
</template>
<script>
export default {
  props: {
    route: {
      required: true,
    },
  },
  data() {
    const shareContent = encodeURIComponent("https://lichen.com/" + this.route);
    const twitter = "https://twitter.com/intent/tweet?text=" + shareContent;

    return {
      facebook: "https://www.facebook.com/sharer/sharer.php?u=" + shareContent,
      twitter: twitter,
    };
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen

.links
  display: inline-block

.links *
  width: 30px
  height: 30px

.links *:hover
  color: $primary

a
  color: black
</style>
