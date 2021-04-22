<template>
  <div class="form-diapo">
    <div
      :class="{ 'open-bar': true, 'open-bar-active': open }"
      @click="open = !open"
    >
      <icon :icon="['fas', 'chevron-right']" v-if="!open" />
      <icon :icon="['fas', 'chevron-down']" v-else />
      Diapo
    </div>
    <div class="body" v-if="open">
      <imgSelector
        ref="table"
        @changeElem="elemChange"
        :url="url + '?id_project=' + id_project"
      />

      <div>
        <ToggleButtonState v-model="hiddenAddPanel"
          ><icon :icon="['fas', 'plus']"
        /></ToggleButtonState>
        <Button v-if="elem" @click.native="openModalDelete"
          ><icon :icon="['fas', 'trash']"
        /></Button>
      </div>

      <SetterEnv
        v-if="hiddenAddPanel && elem"
        :fields="fields"
        v-model="elem"
      />

      <Form
        v-else-if="!hiddenAddPanel"
        :url="url + '/post'"
        :inputs="inputs"
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
export default {
  name: "DiapoSetter",
  props: {
    id_project: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      open: false,

      inputs: [{ attr: "path", type: "file" }],
      url: "/diapo",
      getterFilter: "?id_project=",
      fields: {
        section: "diapo",
        attr: [{ name: "path", type: "file" }]
      },

      elem: null,
      hiddenAddPanel: true,
      modalActive: false
    };
  },
  watch: {},
  methods: {
    beforeSend(form) {
      form.append("id_project", this.id_project);
    },

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
    }
  }
};
</script>
<style scoped>
.form-diapo {
  background-color: white;
  border-radius: 4px;
  padding: 6px;
}

.body-active {
  border-left: 1px solid black;
}

.body,
.body-active {
  padding: 20px;
}

.open-bar {
  font-size: 1.3em;
  padding: 10px;
  border-bottom: 1px solid transparent;
  cursor: pointer;
}

.open-bar:hover,
.open-bar-active {
  border-bottom: 1px solid black;
}

.open-bar-active {
}

.active {
  background-color: black;
  color: white;
  border-top-left-radius: 20px;
  border-left: 1px solid black;
}
</style>
