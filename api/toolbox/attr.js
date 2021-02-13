const parse = require("./parser");

class Attr {
  constructor(params) {
    if (!params.type)
      return console.warn("type isn't defined for attr " + this.name);
    if (!params.name)
      return console.warn("no name for elem of type ", this.type);
    if (!params.variableSql)
      return console.warn(
        "no var sql defined for attr ",
        this.type,
        " ",
        this.name
      );

    this.name = params.name;
    this.type = params.type;
    this.update = params.update || true;
    this.filter = params.filter || false;
    this.notnull = params.notnull || false;
    this.variableSql = params.variableSql;
    this.sort = params.sort;
    this.required = params.required;
    this.search = params.search;
  }

  getCreateStr() {
    return (
      this.name +
      " " +
      this.variableSql +
      " " +
      (this.notnull ? " not null" : "")
    );
  }

  //controller part
  wrapper(elem) {
    return elem || "";
  }

  getStr() {
    return this.wrapper(this.name);
  }

  decode(elem) {
    return elem;
  }

  strInsert(tableName) {
    return "?";
  }

  getUpdateStr(attr, value) {
    return attr + " = " + this.wrapper(value);
  }

  //router part
  async parse(value) {
    return parse.secureSql(value);
  }

  afterUpdate(req, res) {}

  async updateAttr(controller, params) {
    return controller.update(params.id, params.attr, params.value);
  }

  print() {
    var strExtra = "";
    if (this.notnull) strExtra += " notnull";
    if (this.update) strExtra += " update";
    if (this.filter) strExtra += " filter";
    console.log(this.name + " " + this.type + strExtra);
  }
}

module.exports = Attr;
