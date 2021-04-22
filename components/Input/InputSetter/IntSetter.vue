<template>
  <div class="inputSetter">
    <p id="title" class="pres">
      {{ query.namePrint }}
    </p>
    <IntInput ref="input" v-model="value" @focus="focus" />
    <SetterButtons
      @confirm="confirm"
      @reset="reset"
      @edit="edit"
      v-model="modeEdition"
    />
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler";

export default {
  props: {
    query: {},
    init: {}
  },
  data() {
    return {
      value: this.init,
      modeEdition: false,
      save: 0
    };
  },
  watch: {
    init(val) {
      this.value = val;
    }
  },
  methods: {
    edit() {
      this.modeEdition = true;
      this.$refs.input.focus();
    },
    reset() {
      this.value = this.save;
    },
    check() {
      return /^[0-9]*\.?[0-9]*$/.test(this.value)
        ? true
        : { error: "not int format" };
    },
    confirm() {
      this.save = this.value;

      var check = this.check();
      if (check.error) {
        this.$store.commit("setMsgApi", check);
        return;
      }

      apiHandler.setAttr(this.query, this.value).then(msg => {
        msg = msg.data;
        if (!msg.error) {
          this.$emit("update", msg);

          msg.msg = "Édition effectuée";
        }
        this.$store.commit("setMsgApi", msg);
      });
    },
    focus() {
      this.modeEdition = true;
    }
  }
};
</script>
<style lang="sass" scoped>
@import ~/assets/manage
</style>
