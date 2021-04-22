<template>
  <div>
    <div>
      <div class="header-pagebackoffice">
        <Header>{{ name }} </Header>
        <input type="text" placeholder="recherche" v-model="regexStr" />
      </div>
      <Table
        ref="table"
        @changeElem="elemChange"
        :xtitle="xtitleActif"
        :uniqueKey="uniqueEntry"
        :url="'/' + url + getterFilter"
        :regex="regex"
        :sort="setIndex"
      />
      <div class="btns">
        <ListOptions :list="columnIndications" @updateList="updateOptions" />
        <ToggleButtonState v-if="!uniqueEntry" v-model="hiddenAddPanel"
          ><icon :icon="['fas', 'plus']"
        /></ToggleButtonState>
        <Button v-if="!uniqueEntry && elem" @click.native="openModalDelete"
          ><icon :icon="['fas', 'trash']"
        /></Button>
        <template v-if="setIndex && elem">
          <Button @click.native="goUp">
            <icon :icon="['fas', 'long-arrow-alt-up']" />
          </Button>
          <Button @click.native="goDown">
            <icon :icon="['fas', 'long-arrow-alt-down']" />
          </Button>
        </template>
      </div>
      <SetterEnv
        v-if="hiddenAddPanel && elem"
        :fields="attributes"
        :url="url"
        :uniqueEntry="uniqueEntry"
        v-model="elem"
      />

      <FormInsert
        v-else-if="!hiddenAddPanel"
        :url="url"
        :inputs="addFields"
        @send="update"
        @beforeSend="beforeSend"
      />
      <ModalBox
        v-model="modalActive"
        title="Delete Element"
        @validate="deleteElem"
      />
    </div>
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler";

export default {
  name: "PageBackoffice",
  props: {
    name: {},
    attributes: {}, // setters variables
    xtitles: {},
    url: {
      type: String,
      required: true,
    },
    getterFilter: {
      type: String,
      default: "",
    },
    addFields: {},
    uniqueEntry: {
      type: Boolean,
      default: false,
    },
    setIndex: {},
  },
  data() {
    var columnIndications = this.xtitles;
    // by default if no one column Selector was provided we select the three first
    if (columnIndications.filter((col) => col.active).length == 0) {
      columnIndications.slice(0, 3).forEach((col) => (col.active = true));
    }

    return {
      elem: null, //elementSelected
      hiddenAddPanel: true, //hidden the insert Element panel
      modalActive: false, // show dialog modal of suppression
      columnIndications: columnIndications,
      regexStr: "", //regex str of filter
    };
  },
  computed: {
    xtitleActif() {
      return this.columnIndications.filter((xtitle) => xtitle.active);
    },
    regex() {
      return RegExp(this.regexStr, "gi");
    },
  },

  methods: {
    elemChange(elem) {
      console.log(elem);
      this.elem = elem;
      history.pushState({}, null, this.$route.path + "?id=" + elem.id);
    },
    update() {
      this.$refs.table.get();
    },
    openModalDelete() {
      this.modalActive = true;
    },
    deleteElem() {
      this.$axios //TODO api handler
        .get("/api/" + this.fields.section + "/del/" + this.elem.id)
        .then((r) => {
          this.$store.commit("setMsgApi", r);
          this.$refs.table.get();
        });
    },
    beforeSend(form) {
      this.$emit("beforeSend", form);
    },
    async swapIndex(src1, src2) {
      //TODO make a super class for preset action apiHandler BackofficeApiHandler
      await apiHandler.postStandard(
        "/api/" + this.fields.section + "/set/" + src1.id,
        {
          attr: this.setIndex.attr,
          value: src2.index,
        }
      );

      await apiHandler.postStandard(
        "/api/" + this.fields.section + "/set/" + src2.id,
        {
          attr: this.setIndex.attr,
          value: src1.index,
        }
      );

      const tmp = src2.index;
      src2.index = src1.index;
      src1.index = tmp;

      this.$refs.table.get();
    },
    goUp() {
      const index = this.elem.i;
      if (index <= 0) return;

      const prevElem = this.$refs.table.getElem(index - 1);
      this.swapIndex(this.elem, prevElem);
      this.elem.i--;
    },
    goDown() {
      const index = this.elem.i;
      if (index >= this.$refs.table.getMaxItems() - 1) return;

      const nextElem = this.$refs.table.getElem(index + 1);
      this.swapIndex(this.elem, nextElem);
      this.elem.i++;
    },
    updateOptions(active, index) {
      this.columnIndications[index].active = active;
    },
  },
};
</script>
<style lang="sass" scoped>
@import ~/assets/manage

.btns
  background-color: white
  border-bottom-left-radius: 4px
  border-bottom-right-radius: 4px
  padding-bottom: 4px

.header-pagebackoffice
  color: $color
  display: flex
  justify-content: space-between

  & input
    height: 2rem
    margin-top: auto
    margin-bottom: auto
    width: 30%
    border: none
    color: $color
    border-bottom: 2px solid $color
    background-color: transparent
    font-size: 1.3rem

  & input::placeholder
    color: grey
</style>
