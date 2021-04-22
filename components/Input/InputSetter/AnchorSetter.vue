<template>
  <div>
    <Setter
      :query="query"
      @edit="edit"
      @confirm="confirm"
      @reset="reset"
      ref="setter"
    >
      <div>
        <div>
          <IntInput
            v-model="val.x"
            @focus="f"
            ref="input"
            name="x"
            description="%"
          />
          <IntInput v-model="val.y" @focus="f" name="y" description="%" />
        </div>
        <AnchorInput @change="setAnchor" />
      </div>
    </Setter>
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler.js";

export default {
  props: {
    query: {
      type: Object,
      required: true
    },
    init: {}
  },
  data() {
    var val = {
      x: this.init ? this.init.x : 50,
      y: this.init ? this.init.y : 0
    };
    return {
      val: val,
      save: null
    };
  },
  methods: {
    edit() {
      this.$refs["input"].focus();
      this.save = this.val;
    },
    f() {
      this.save = { ...this.val };
      this.$refs.setter.modeEditionSet(true);
    },
    reset() {
      this.val.x = this.save.x;
      this.val.y = this.save.y;
    },
    confirm() {
      apiHandler.setScheme(
        this.query,
        {
          X: this.val.x,
          Y: this.val.y
        },
        r => {
          var msg = r.data;
          if (!msg.error) msg.msg = "Édition effectuée";
          this.$store.commit("setMsgApi", msg);
          this.$emit("update", r.data);
        }
      );
      this.save = this.val;
    },
    setAnchor(val) {
      this.save = { ...this.val };
      this.val.x = val.x;
      this.val.y = val.y;
      this.$refs.setter.modeEditionSet(true);
    }
  }
};
</script>
<style></style>
