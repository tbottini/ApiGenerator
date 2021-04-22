<template>
  <div class="cell hov-color-5 height-100">
    <div class="day">{{ day }}</div>
    <div class="cell-content" v-if="event.length">
      <label v-for="(e, i) in eventSort" :key="i">
        <nuxt-link :to="e.path" class="hov-color-5">
          <label style="font-weight: bold" class="hov-click"
            >{{ e.hour }}h{{ e.minutes || "" }}</label
          >
          / {{ e.name }}<br />
        </nuxt-link>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    event: {
      type: Array,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
  },
  computed: {
    eventSort() {
      return this.event.sort((a, b) => {
        if (a.hour == b.hour) return a.minutes > b.minutes;
        return a.hour > b.hour;
      });
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/lichen.sass

.day
  color: $primary
  width: 100%
  text-align: right
  padding: 4px
  font-size: 1.7rem
  font-weight: 200
  padding-right: 10px
  font-family: $fontLight
  right: 0

.cell
  position: relative

.cell-content
  padding: 0 10px
  padding-bottom: 10px

.cell:hover .day
  color: white

.height-100
  height: 100%
</style>
