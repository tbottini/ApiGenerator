const Attr = require("../attr");
const error = require("../error");

const maxInt = {
  tiny: 255,
  medium: 2 ** 31
};

const minInt = {
  tiny: -254,
  medium: -2 * 31 - 1
};

const name = {
  tiny: "smallint",
  medium: "INT"
};

class Int extends Attr {
  constructor(param) {
    var type = "int";

    var size = param.size || "medium";

    var variableSql = name[size];

    super({
      name: param.name,
      type: type,
      update: param.update,
      filter: param.filter,
      notnull: param.notnull,
      variableSql: variableSql,
      sort: param.sort,
      required: param.required
    });

    this.min = param.min || minInt[size];
    this.max = param.max || maxInt[size];
  }

  async parse(value) {
    var elem = value;
    if (!elem) return error.uncomplete;
    if (!/^\d+$/.test(elem)) return error.badType("int");
    elem = parseInt(elem);
    if (this.min && elem < this.min) return error.minimumError(this.min);
    else if (this.max && elem > this.max) return error.maximumError(this.max);
    else if (elem < minInt.tiny) return error.minimumError(minInt.tiny);
    else if (elem > maxInt.tiny) return error.maximumError(maxInt.tiny);
    return elem;
  }

  wrapper(elem) {
    return elem || 0;
  }

  //wrapper before implement
  //parser after extraction
  //checker before ask implement

  //check -> wrap -> request -> parser -> return
}

module.exports = Int;
