<template>
       <div id="nav-header">
        <nuxt-link to="/"><h1 @click="$store.commit('selectLogo')" :class="'logo-' + $mq">Kid A</h1></nuxt-link>
        <MenuHori class="menu-hori" :dir="dir"></MenuHori>
      </div>   
</template>
<script>
export default {
    props: {
        dir: {
          type: Array,
          required: true,
        }
    },

}
</script>
<style scoped>

.menu-hori
{
  width: 100%;
}

a
{
  text-decoration: none;
}

.container
{
  position: relative;
  background-color: black;
  height: 100%;
}

.logo-mobile
{
  font-size: clamp(1px, 11vw, 2.5em) !important;
}

.logo-desktop, .logo-mobile
{
  text-decoration: none;
  color: white;
  font-size: 2.5em;
  white-space: nowrap;
  flex:0;
}

#nav-header
{
    display: flex;
  z-index: 10;
  color: white;
  flex-direction: row;
}

</style>