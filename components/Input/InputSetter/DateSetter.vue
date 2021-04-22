<template>
  <div class="inputSetter">
    <p id="title" class="pres">{{ query.attr }}</p>
    <InputDate
      ref="input"
      @change="changeDate"
      :date="currentDate"
      @focus.native="modeEdition = true"
    />
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
import dateLib from "~/assets/dateLib.js";

export default {
  props: {
    date: {
      type: String,
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    init: {
      required: true
    }
  },
  watch: {
    init(val) {
      console.log("Date changed", val);
      this.currentDate = new Date(val);
    }
  },
  data() {
    console.log("init", this.init, new Date(this.init));
    return {
      currentDate: new Date(this.init),
      saveDate: null,
      modeEdition: false
    };
  },
  methods: {
    changeDate(date) {
      this.saveDate = this.currentDate;
      this.currentDate = date;
      this.modeEdition = true;
    },
    reset() {
      this.modeEdition = false;
      this.currentDate = null;
    },
    confirm() {
      console.log(this.currentDate);
      this.saveDate = this.currentDate;
      this.modeEdition = false;

      if (this.query) {
        var stringDate = dateLib.dateToString(this.currentDate);
        apiHandler
          .set(
            this.query.apiSection,
            this.query.id,
            this.query.attr,
            stringDate
          )
          .then(r => {
            r = r.data;
            this.$emit("update", r);
            if (!r.error) r.msg = "Édition effectuée";
            this.$store.commit("setMsgApi", r);
          });
      }
    },
    edit() {
      this.$refs.input.focus();
    }
  }
};
</script>
<style lang="sass" scoped>
#btns
  display: flex;
  flex-direction: row;

@import ~/assets/manage
</style>
