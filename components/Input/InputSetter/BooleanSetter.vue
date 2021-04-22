<template>
  <div class="booleanSetter">
    <p id="title" class="pres">
      {{ query.namePrint }}
    </p>
    <ToggleButton ref="toggle" v-model="currentState" @change="confirm">
    </ToggleButton>
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler.js";

export default {
  props: {
    query: {},
    init: {}
  },
  data() {
    console.log(this.query);
    return {
      currentState: this.init
    };
  },
  watch: {
    init() {
      this.currentState = this.init == 1;
      //this.$refs.toggle.$forceUpdate();
    },
    currentState(val) {
      console.log(val, this.query);
    }
  },
  methods: {
    confirm() {
      apiHandler.setAttr(this.query, this.currentState).then(r => {
        this.$emit("update", r.data);
      });
    }
  }
};
</script>
<style lang="sass" scoped>
@import ~/assets/manage
.booleanSetter
  background-color: white;
  padding: 6px;
  border-radius: 4px;
</style>
