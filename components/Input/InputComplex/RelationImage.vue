<template>
  <div class="form-diapo">
    <p class="pres">
      {{ query.namePrint }}
    </p>
    <ImgSelector ref="table" @changeElem="elemChange" :imgs="imgs" />
    <IconButton v-if="elem" icon="trash" @click="deleteElem" />
    <InputFile @changeFile="addElement" />
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler.js";

export default {
  name: "DiapoSetter",
  props: {
    query: {},
  },
  data() {
    var extra = this.query.extra;

    this.getElements(this.query.id);

    return {
      extra,
      elem: null,
      index: null,
      imgs: [],
    };
  },
  watch: {
    query(val) {
      this.getElements(this.query.id);
    },
  },
  methods: {
    getElements(id) {
      this.$axios
        .get(
          "/api/" +
            this.query.extra.table_get +
            "?" +
            this.query.extra.link_attr +
            "=" +
            id
        )
        .then((r) => {
          r = r.data;
          this.imgs = r.map((i) => {
            return {
              ...i,
              src: i[this.query.extra.push_attr],
            };
          });
        });
    },
    elemChange(elem, index) {
      this.elem = elem;
      this.index = index;
    },
    addElement(file) {
      var form = new FormData();
      form.append(this.extra.push_attr, file);
      form.append(this.extra.link_attr, this.query.id);

      apiHandler
        .post("/api/" + this.extra.table_get + "/post", form)
        .then((r) => {
          console.log(r.data);
          this.imgs.push({
            id: r.data.id,
            src: r.data[this.extra.push_attr],
          });
        });
    },
    deleteElem() {
      this.$axios
        .get("/api/" + this.extra.table_get + "/del/" + this.elem.id)
        .then((r) => {
          this.imgs.splice(this.index, 1);
          this.elem = null;
          this.index = null;

          this.$store.commit("setMsgApi", r);
        });
    },
  },
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
