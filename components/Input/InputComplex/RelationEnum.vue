<template>
  <div class="inputSetter">
    <p id="title" class="pres">
      {{ query.namePrint }}
    </p>
    <TagList :elements="tagElements" @untag="untag" />
    <ListSelection @select="select" :items="itemsList" />
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler";

export default {
  props: {
    query: {
      required: true
    }
  },
  data() {
    this.find();
    console.log(this.query.extra.enum);

    return {
      itemsList: this.query.extra.enum,
      chooseElements: [],
      links: [],
      post: this.query.extra.table_link,
      ...this.query.extra
    };
  },
  watch: {
    query(val) {
      this.find();
    }
  },
  methods: {
    //get all information for update and select relations
    find() {
      const { table_link, link_attr } = this.query.extra;

      console.log(this.query.extra);
      var post = table_link;
      const promiseLink = this.$axios.get(
        "/api/" + post + "?" + link_attr + "=" + this.query.id
      );

      var links = [],
        relElements = [];
      promiseLink.then(values => {
        links = values.data;

        this.itemsList = this.enum.map((element, index) => {
          return {
            active: !!this.enum[element[this.search_attr]],
            name: element,
            id: index
          };
        });
      });
    },
    confirm() {},
    untag(elem) {
      this.active(elem);
    },
    select(index) {
      this.active(this.itemsList[index]);
    },
    active(item) {
      item.active = !item.active;
      if (item.active) {
        var form = {};
        form[this.link_attr] = this.query.id;
        form[this.search_attr] = item.name;
        console.log(form);

        apiHandler.postStandard("/api/" + this.post + "/post", form).then(r => {
          this.links.push(r.data);
        });

        //apiHandler.postForm(this.post, )
      } else {
        //get id links
        var link = this.links.findIndex(
          l =>
            l[this.search_attr] == item.id && l[this.link_attr] == this.query.id
        );
        if (link === "undefined") return console.error("no active link find");
        var id = this.links[link].id;
        this.links.splice(link, 1);
        this.$axios.get("/api/" + this.post + "/del/" + id);
      }
    },
    remove(index) {}
  },
  computed: {
    tagElements() {
      return this.itemsList.filter(i => i.active);
    }
  }
};
</script>
<style lang="sass" scoped>
@import ~/assets/setter
</style>
