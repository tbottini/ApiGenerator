const Attr = require("../attr.js");
const parse = require("../parser");

class List extends Attr {
  constructor(param) {
    const variableSql = "int";
    const type = "list";

    param.variableSql = variableSql;
    param.type = type;
    super(param);

    this.attributes = param.attr;
  }

  async parse(value) {
      
  }

  async wrapper(elem, object) {

  }

  async decode(value) {
      
  }

  //comment implementer un filter
  //api/exemple_table/attr_list/subattr?value=value
  //call with inner join
}



module.exports List;