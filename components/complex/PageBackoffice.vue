<template>
  <div>
    <div>
      <Header>{{ name }}</Header>
      <Table
        ref="table"
        @changeElem="elemChange"
        :xtitle="xtitleActif"
        :url="url + getterFilter"
      />
      <div class="btns">
        <ListOptions :list="listOptions" @updateList="updateOptions" />
        <ToggleButtonState v-if="!uniqueEntry" v-model="hiddenAddPanel"
          ><icon :icon="['fas', 'plus']"
        /></ToggleButtonState>
        <Button v-if="!uniqueEntry && elem" @click.native="openModalDelete"
          ><icon :icon="['fas', 'trash']"
        /></Button>
        <template v-if="setIndex && elem">
          <IconButton icon="long-arrow-alt-up" @click="goUp" />
          <IconButton icon="long-arrow-alt-down" @click="goDown" />
        </template>
      </div>
      <SetterEnv
        v-if="hiddenAddPanel && elem"
        :fields="fields"
        :uniqueEntry="uniqueEntry"
        v-model="elem"
      />
      <Form
        v-else-if="!hiddenAddPanel"
        :url="url + '/post'"
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
    fields: {},
    xtitle: {},
    url: {
      type: String,
      required: true
    },
    getterFilter: {
      type: String,
      default: ""
    },
    addFields: {},
    uniqueEntry: {
      type: Boolean,
      default: false
    },
    setIndex: {},
    xtitlePos: {}
  },
  data() {
    var listOptions;
    if (!this.xtitlePos)
      listOptions = this.xtitle.map(xtitle => {
        return { name: xtitle, active: true };
      });
    else
      listOptions = this.xtitlePos.map(xtitle => {
        return {
          name: xtitle,
          active: this.xtitle.includes(xtitle)
        };
      });
    return {
      elem: null,
      hiddenAddPanel: true,
      modalActive: false,
      listOptions: listOptions
    };
  },
  computed: {
    xtitleActif() {
      return this.listOptions
        .filter(xtitle => xtitle.active)
        .map(xtitle => xtitle.name);
    }
  },
  methods: {
    elemChange(elem) {
      this.elem = elem;
    },
    update(elem) {
      this.$refs.table.get();
    },
    openModalDelete() {
      this.modalActive = true;
    },
    deleteElem() {
      this.$axios
        .get("/api/" + this.fields.section + "/del/" + this.elem.id)
        .then(r => {
          this.$store.commit("setMsgApi", r);
          this.$refs.table.get();
        });
    },
    beforeSend(form) {
      this.$emit("beforeSend", form);
    },
    indexesElem(index) {
      var next = this.$refs.table.getIndex(index);
      if (!next) return;
      this.$axios
        .post("/api/" + this.fields.section + "/swap", {
          currentIndex: this.elem[this.setIndex.attr],
          newIndex: next[this.setIndex.attr]
        })
        .then(async r => {
          r = r.data;
          this.elem = await this.$refs.table.get();
        });
    },
    goUp() {
      this.indexesElem(this.elem.index - 1);
    },
    goDown() {
      this.indexesElem(this.elem.index + 1);
    },
    updateOptions(active, index) {
      this.listOptions[index].active = active;
    }
  }
};
</script>
<style scoped>
.btns {
  background-color: white;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding-bottom: 4px;
}
</style>
