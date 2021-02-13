<script>
export default {
  render(h) {
    var cells = [];
    if (this.xtitle) {
      this.xtitle.forEach((val, i) => {
        cells.push(
          h("div", {
            domProps: {
              innerHTML: val
            },
            class: {
              xtitle: true
            },
            key: i
          })
        );
      });

      if (this.data && !this.data.error) {
        /* if (typeof this.data == "object")
                    this.data = [this.data];*/
        if (this.data.constructor !== Array) this.data = [this.data];
        this.data.forEach((val, j) => {
          val.index = j;
          for (var i = 0; i < this.xtitle.length; i++) {
            cells.push(
              h(
                "div",
                {
                  class: {
                    cell: true,
                    selected: val["id"] == this.idSelect
                  },
                  on: {
                    click: e => {
                      this.idSelect = val["id"];
                      val.index = j;
                      this.$emit("changeElem", val);
                    }
                  }
                },
                [
                  h("p", {
                    domProps: {
                      innerHTML: val[this.xtitle[i]]
                    },
                    class: {
                      "cell-paragraph": true
                    }
                  })
                ]
              )
            );
          }
        });
      }
    }

    var styleTable = this.xtitle
      ? {
          "grid-template-columns": `repeat(${this.xtitle.length}, ${"1"}fr)`
        }
      : {};

    return h(
      "div",
      {
        class: {
          table: true
        },
        style: styleTable
      },
      cells.concat([
        h("div", [
          h(
            "div",
            {
              class: {
                actions: true
              }
            },
            [
              /*h('button', 'delete'),
                            h('button', 'create')*/
            ]
          )
        ])
      ])
    );
  },
  mounted() {
    this.get();
  },
  data() {
    return {
      data: null,
      idSelect: null
    };
  },
  props: {
    url: {
      type: String,
      default: "/users/"
    },
    xtitle: {
      type: Array,
      required: false
    },
    id: {}
  },
  methods: {
    async get() {
      var res = await this.$axios.get("/api" + this.url);
      this.data = res.data;
      return this.getSelect();
      //return this.getSelect();
    },
    select(id) {
      this.idSelect = id;
      this.$emit("changeElem", this.data[id]);
    },
    findElement(id) {
      this.$axios.get("/api" + this.url + "/" + id).then(r => {
        if (!r.data.error) this.data.push(r.data);
        this.$store.commit("setMsgApi", r.data);
      });
    },
    addElem(elem) {
      this.data.push(elem);
    },
    getIndex(index) {
      if (index < 0 || index >= this.data.length) return null;
      return this.data[index];
    },
    getElem(index) {
      return this.data[index];
    },
    getSelect() {
      return this.data.find(e => {
        return e.id == this.idSelect;
      });
    }
  }
};
</script>
<style scoped>
.table {
  display: grid;
}

.xtitle {
  background-color: #495464;
  color: white;
  text-transform: uppercase;
  font-size: 1.2em;
  padding: 4px;
}

.cell-paragraph {
  margin: 4px;
  margin-bottom: 10px;
  font-size: 1.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* number of lines to show */
  -webkit-box-orient: vertical;
}

.cell {
  word-wrap: anywhere;
  cursor: pointer;
  background-color: white;
}

.selected {
  background-color: #bbbfca;
  color: white;
}
</style>
