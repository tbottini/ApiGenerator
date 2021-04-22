<template>
  <div class="inputSetter">
    <p id="title" class="pres">
      {{ query.namePrint }}
    </p>
    <InputTextAdaptive
      v-if="!htmlEdit"
      ref="input"
      :query="query"
      v-model="text"
      @focus="focus"
    />

    <InlineSetter
      v-else
      ref="input"
      :query="query"
      v-model="text"
      @focus="focus"
    />

    <SetterButtons
      @confirm="save"
      @reset="reset"
      @edit="activeEditable"
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
      text: this.init,
      modeEdition: false,
      saveText: ""
    };
  },
  methods: {
    focus() {
      this.modeEdition = true;
      this.activeEditable();
    },
    activeEditable() {
      this.saveText = this.text;
      this.$refs.input.focus();
    },
    reset() {
      this.$refs.input.setText(this.saveText);
      this.text = this.saveText;
    },
    save() {
      var content = this.text ? this.text.trim() : "";
      this.saveText = this.text;
      apiHandler
        .set(this.query.apiSection, this.query.id, this.query.attr, content)
        .then(msg => {
          msg = msg.data;
          if (!msg.error) {
            this.$emit("update", msg);

            msg.msg = "Édition effectuée";
          }
          this.$store.commit("setMsgApi", msg);
        });
    }
  },
  computed: {
    htmlEdit() {
      return this.query?.extra?.htmlEdit;
    }
  },
  watch: {
    init(newVal) {
      this.text = newVal;
      this.$refs.input.setText(newVal);
    }
  }
};
</script>
<style lang="sass" scoped>
@import ~/assets/manage
</style>
