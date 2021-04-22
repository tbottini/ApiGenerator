<template>
  <div id="modal" :hidden="!value">
    <div id="box">
      <div id="headermodal">
        <Button class="close-btn" @click.native="$emit('change', false)"
          ><icon :icon="['fas', 'times']"
        /></Button>
        <div id="center">
          {{ title }}
        </div>
        <div></div>
      </div>
      <div id="content-modal">
        <slot></slot>
      </div>
      <div id="actions">
        <Button @click.native="$emit('change', false)">Cancel</Button>
        <Button @click.native="validate">Validate</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      default: false,
      type: Boolean
    },
    title: {
      default: "Dialog",
      type: String
    }
  },
  methods: {
    validate() {
      this.$emit("validate");
      this.$emit("change", false);
    }
  }
};
</script>
<style scoped>
#modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 10%;
  top: 0;
  background-color: #00000099;
  box-shadow: 1px 3px 3px 0px lightgrey;
  z-index: 100;
}

#box {
  position: relative;
  top: 10%;
  min-height: 400px;
  background-color: white;
  border-radius: 20px;
  border: 1.5px solid lightgrey;
  display: flex;
  flex-direction: column;
  min-height: 30%;
  margin: 0 20%;
  max-height: 80%;
}

#headermodal {
  border-bottom: 1px solid grey;
  height: 12%;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: space-between;
  margin-bottom: 20px;
}

#content-modal {
  flex-direction: column;
  overflow-y: scroll;
}

#center {
  position: absolute;
  left: 40%;
  width: 20%;
}

#actions {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  bottom: 0;
}

.close-btn {
  margin-left: 10px;
}
</style>
