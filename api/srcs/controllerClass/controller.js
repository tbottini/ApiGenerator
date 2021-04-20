const app = require("../../app");
const db = app.getDatabase();
const ERROR = require("../parse/error");
const { abort } = require("process");
const ControllerPostgresql = require("./controllerPostgresql");

//provide data in intern interaction

const DEBUG = true;

/**
 * 
 */
class Controller {
  constructor({ name, dictRelation, attr, relation, uniqueKey = false }) {
    this.name = name;
    this.attr = attr;
    this.db = db;

    this.dict = {};
    this.attr.forEach(attributes => (this.dict[attributes.name] = attributes));
    this.ctrl = new ControllerPostgresql({
      attr: this.attr,
      dict: this.dict,
      name: this.name
    });
    this.STRINSERT = this.ctrl.getInsertSql();
    this.setUniqueKey(uniqueKey);
    this.relationSql = this.ctrl.getRelationSql(relation);
    this.relation = dictRelation;
  }

  //db actions
  async init() {
    await db.init(this.ctrl.getCreateSql());

    if (this.uniqueKey) {
      const uniqueEntryExist = await db.all(
        "select id from " + this.name + "  limit 1"
      );
      if (!uniqueEntryExist.length) db.run(this.uniqueKeyStr);
    }
  }

  //get all model of relation
  linkRelation() {
    this.relationSql.forEach(rel => {
      rel.model = require("../../model/" + rel.table_name);
      if (!rel.model) {
        console.error(
          "controller -- linkRelation : ",
          rel.model,
          " model/file unfound"
        );
        process.abort();
      }
      rel.model = rel.model.controller;
    });
  }

  setUniqueKey(isUniqueKey) {
    this.uniqueKey = isUniqueKey;
    if (this.uniqueKey) {
      this.uniqueKeyStr =
        "INSERT INTO " +
        this.name +
        " VALUES (null," +
        this.attr.map(() => "null").join(",") +
        ")";
    }
  }

  async insert(elem) {
    if (this.uniqueKey)
      assert("it'a a unique key table: insert on " + this.name);
    var error = null;

    const values = await Promise.all(
      this.attr.map(async attr => {
        const valueWrap = attr.wrapper(elem[attr.name], elem);

        if (attr.unique) {
          const searchExistant = await this.get(
            valueWrap,
            attr.name,
            attr.name
          );

          if (searchExistant && searchExistant[attr.name])
            error = { error: attr.name + " already exist", code: 1 };
        }

        return valueWrap;
      })
    );
    if (error) return error;

    const results = await Promise.all([
      db.get(`SELECT MAX(id) FROM ${this.name}`),
      db.get(`SELECT nextval('${this.name}_id_seq')`)
    ]);

    if (results[0].max > parseInt(results[1].nextval)) {
      await db.run(
        `SELECT setval('${this.name}_id_seq', (SELECT MAX(id) FROM ${this.name})+1)`
      );
    }

    const res = await db.run(this.STRINSERT, values);
    if (res.error) return ERROR.server;
    return await db.get(
      "select * from " + this.name + " order by id desc limit 1"
    );
  }

  async update(id, attr, value) {
    if (DEBUG) console.log("UPDATE ", id, attr, value);
    var elem = await this.get(id);
    if (!elem) return { error: "entry not found" };

    if (this.dict[attr].unique) {
      const valueWrap = this.dict[attr].wrapper(value, null);
      var e = await this.get(valueWrap, attr, attr);

      if (e[attr]) return { error: attr + " already exist", code: 1 };
    }

    await db.run(
      "update " +
        this.name +
        " set " +
        this.dict[attr].getUpdateStr(attr, value) +
        " where id = \\?",
      [id]
    );
    elem[attr] = this.dict[attr].decode(value);
    return elem;
  }

  async set(attrSelect, valueSelect, attr, value) {
    await db.run("update \\? set \\? = \\? where \\? = \\?", [
      this.name,
      attr,
      value,
      attrSelect,
      valueSelect
    ]);
  }

  //on recupere une relation
  async getRelation() {}

  async get(value, attr = "id", research, relation = true) {
    if (!research) research = this.ctrl.getDefaultSql();

    const getSql = this.ctrl.get(research, this.name);
    var myObj = await db.get(getSql, [attr, value]);

    if (!myObj) return myObj;

    //link table with relation
    //if attr isn't id we cannot link to relation table
    if (attr == "id" && relation) {
      for (var i = 0; i < this.relationSql.length; i++) {
        var relation = this.relationSql[i];
        var relationObj = await db.all(relation.sql + value);
        if (!relationObj) {
          console.error(
            "controller -- get : relation link unwork no entry found, bad name of table ?"
          );
        } else
          myObj[relation.attr] = relation.model.decodeCollection(relationObj);
      }
    }

    return myObj ? this.decodeObject(myObj) : null;
  }

  /**
   * 
   * @param {*} filter //TODO make a filter class
   * @param {*} sort //TODO make a sort class 
   * @param {*} research
   * @param {*} relation 
   * @returns 
   */
  async getAll(filter, sort, research, relation) {
    var filterStr = "",
      sortStr = "",
      innerStr = "";

    if (!research) research = this.ctrl.getDefaultSql();
    if (filter) filterStr = this.ctrl.filterSql(filter);
    if (sort) sortStr = this.ctrl.sort(sort);
    if (relation) innerStr = this.ctrl.innerJoinSql(relation);
    var collection = await db.all(
      this.ctrl.getAllSql(research, filterStr, sortStr, innerStr)
    );
    if (collection.error) {
      console.error(collection);
      return { error: "database error" };
    }
    return this.decodeCollection(collection);
  }

  async delete(id) {
    return await db.run("delete from " + this.name + " where id = '\\?'", [id]);
  }


  /**
   * decodes an object to make it readable
   * it will call the dedicade decode function of each data type
   * @param {Object} object 
   * @returns the object decode 
   */
  decodeObject(object) {
    Object.keys(object).map(attrName => {
      if (this.dict[attrName]) object[attrName] = this.dict[attrName].decode(object[attrName]);
    });
    return object;
  }

  /**
   * decode an collections/list of object to make it readable
   * @param {List<Object>} collection an collection of object who'll be decoded
   * @returns the collection decode
   */
  decodeCollection(collection) {
    return collection.map(element => this.decodeObject(element));
  }

/**
 * will search items in database depending on the token provide
 * @param {Attr} attr 
 * @param {String} token 
 * @returns 
 */
  async search(attr, token) {
    if (!attr)
      return ERROR.attrUnexist(attr);

    return this.decodeCollection(await db.all(this.ctrl.searchSql(attr, token)));
  }
}

module.exports = Controller;
