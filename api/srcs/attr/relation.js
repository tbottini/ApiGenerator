class Relation {
  constructor(param) {
    this.link = param.link || "simple";
    this.table_get = param.table_get;
    this.search_attr = param.search_attr;
    this.table_link = param.table_link;
    this.link_attr = param.link_attr;
    this.print_property = param.print_property;
  }
}

class RelationSimple extends Relation {
  constructor(param) {
    super(param);
  }
}

class RelationInter {
  constructor(param) {
    param.link = "inter";
    super(param);
  }
}

class RelationEnum {
  constructor(param) {
    param.link = "enum";
    super(param);

    this.enum = param.enum;
  }
}

module.exports = {
  Relation,
  RelationSimple,
  RelationInter,
  RelationEnum
};
