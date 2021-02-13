const Attr = require("../attr");

class Boolean extends Attr {
  constructor(param) {
    var type = "boolean";
    var variableSql = type;

    super({
      name: param.name,
      type: type,
      update: param.update,
      filter: param.filter,
      notnull: param.notnull,
      variableSql: variableSql
    });
  }

  decode(value) {
    return value == true || value == 1;
  }

  async parse(value) {
    return value == "true" || value == 1;
  }

  wrapper(elem) {
    return elem || "false";
  }
}

module.exports = Boolean;
