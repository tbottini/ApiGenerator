const Attr = require("../attr");

class Date extends Attr {
  constructor(param) {
    var type = "date";
    var variableSql = "date";

    if (param.activeTime) variableSql = "timestamp";
    else if (param.activeTimezone) variableSql = "timestamp with time zone";

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
    console.log(elem);
    return `'${elem || "now()"}'`;
  }
}

module.exports = Date;
