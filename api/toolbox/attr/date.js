const Attr = require("../attr");

class Date extends Attr {
  constructor(param) {
    var type = "date";
    var variableSql = "date";

    super({
      name: param.name,
      type: type,
      update: param.update,
      filter: param.filter,
      notnull: param.notnull,
      variableSql: variableSql,
      required: param.required
    });
  }

  wrapper(
    elem //before replace value
  ) {
    return `now()`;
  }
}

module.exports = Date;
