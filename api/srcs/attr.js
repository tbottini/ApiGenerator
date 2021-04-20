const parse = require("./parse/parser");

/**
 * 
 */
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
    this.private = params.private;
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

  /**
   * makes the data usable by the database 
   * @param {*} elem 
   * @param {*} object 
   * @returns 
   */
  wrapper(elem) {
    return elem || "";
  }

  getStr() {
    return this.wrapper(this.name);
  }
  
  /**
   * decodes an object to make it readable
   * @param {*} elem 
   * @returns 
   */
  decode(elem) {
    return elem;
  }

  strInsert(/*tableName*/) {
    return "\\?";
  }

  getUpdateStr(attr, value) {
    return attr + " = " + this.wrapper(value);
  }

  /**
   * make the data secure for the database
   * no sql injection
   * @param {*} value 
   * @returns 
   */
  async parse(value) {
    return parse.secureSql(value);
  }


  afterUpdate(/*req, res*/) {}

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

  log(msg) {
    console.log(`${this.type}(${this.name}) - `, msg);
  }
}

module.exports = Attr;
