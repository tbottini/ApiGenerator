<template>
  <div style="margin: 0" v-if="elem">
    <div v-for="(attr, index) in inputs.attr" :key="index">
      <InputSetter
        v-if="attr.type == 'string'"
        @update="updateElem($event, attr)"
        :query="query(attr)"
        :init="elem[attr.name]"
      />
      <DateSetter
        v-else-if="attr.type == 'date'"
        @update="updateElem($event, attr)"
        :date="elem[attr.name]"
        :query="query(attr)"
      />
      <ImgSetter
        v-else-if="attr.type == 'image'"
        :query="query(attr)"
        @update="updateElem($event, attr)"
        :edit="true"
        :src="'/api/static/' + elem[attr.name]"
      />
      <FileSetter
        v-else-if="attr.type == 'file'"
        :query="query(attr)"
        @update="updateElem($event, attr)"
        :edit="true"
        :src="elem[attr.name]"
      />
      <PasswordSetter v-else-if="attr.type == 'password'" />
      <BooleanSetter
        v-else-if="attr.type == 'boolean'"
        :query="query(attr)"
        @update="updateElem($event, attr)"
        :init="elem[attr.name]"
      />

      <AnchorSetter
        v-else-if="attr.type == 'anchor'"
        :query="query(attr)"
        @update="updateElem($event, attr)"
        :init="elem[attr.name]"
      />

      <DiapoSetter
        v-else-if="attr.type == 'diapo'"
        :id_project="elem.id"
        :setIndex="attr.setIndex"
      />

      <div v-else>error</div>
    </div>
  </div>
</template>
<script>
//passage à du rendu jsx

export default {
  name: "SetterEnv",
  model: {
    prop: "elem",
    event: "updateElem"
  },
  props: {
    fields: {},
    uniqueEntry: {
      //exemple config table have unique entry
      type: Boolean,
      default: false
    },
    elem: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      inputs: this.fields,
      test: false
    };
  },
  watch: {
    elem() {
      console.log("SetterEnv id changed", this.elem.id);
    }
  },
  methods: {
    updateElem(elem, attr) {
      this.elem[attr.name] = elem[attr.name];
      this.$emit("updateElem", this.elem);
    },
    query(attr) {
      return {
        id: !this.uniqueEntry ? this.elem.id : null,
        apiSection: this.inputs.section,
        attr: attr.name,
        namePrint: attr.namePrint || attr.name,
        help: attr.help
      };
    }
  }
};
</script>
