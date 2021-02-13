const app = require("../app");
const db = app.getDatabase();
const assert = require("assert");

class Controller {
  constructor({ name, attr, relation, uniqueKey = false }) {
    this.name = name;
    this.attr = attr;
    this.db = db;

    this.STRINSERT = this.getInsertSql();

    this.setUniqueKey(uniqueKey);

    this.dict = {};
    this.attr.map(attributes => (this.dict[attributes.name] = attributes));

    this.relationSql = this.getRelationSql(relation);
  }

  getCreateSql() {
    let attrFields = this.attr.map(attr => attr.getCreateStr()).join(",\n");
    return `CREATE TABLE IF NOT EXISTS ${this.name} (
						id SERIAL PRIMARY KEY ,
						${attrFields})`;
  }

  async getIndexInsert() {
    const getLastId =
      "select 1 + (select id from " +
      this.name +
      ' order by id desc limit 1) as "id"';

    var id = await db.get(getLastId);
    id = id && id.id ? id.id : 0;
    console.log("ID", id);
    return id;
  }

  getInsertSql() {
    let attrField = this.attr.map(a => a.name).join(",");

    let valuesUnknow = this.attr
      .map(attribute => attribute.strInsert(this.name))
      .join(",");
    return `INSERT INTO ${this.name} (id, ${attrField}) VALUES (?, ${valuesUnknow})`;
  }

  /*
    renvoie des str Sql permettant de récupéré un attribut
    sur une autre table
    en fonction de l'id procuré par ce controlleur
  */
  getRelationInterSql(rel) {
    return {
      attr: rel.table_get,
      sql: `select ${rel.table_get}.* from ${rel.table_link}
        inner join ${rel.table_get}
        on ${rel.table_get}.id = ${rel.table_link}.${rel.search_attr}
        where ${rel.table_link}.${rel.link_attr} = `
    };
  }

  getRelationSimpleSql(rel) {
    return {
      attr: rel.table_get,
      sql: `select * from ${rel.table_get}
        where ${rel.link_attr} = `
    };
  }

  getRelationSql(relation) {
    var relationSql = [];
    if (!relation) return relationSql;
    relation.forEach(rel => {
      if (rel.link == "inter") rel = this.getRelationInterSql(rel);
      else if (rel.link == "simple" || rel.link == "image")
        rel = this.getRelationSimpleSql(rel);
      else return assert("bad relation type for relation table");
      relationSql.push(rel);
    });
    return relationSql;
  }

  linkRelation() {
    this.relationSql.forEach(rel => {
      rel.model = require("../model/" + rel.attr);
      rel.model = rel.model.controller;
    });
  }

  setUniqueKey(isUniqueKey) {
    this.uniqueKey = isUniqueKey;
    if (this.uniqueKey) {
      this.uniqueKeyStr =
        "INSERT INTO " +
        this.name +
        " VALUES (0," +
        this.attr.map(a => "null").join(",") +
        ")";
    }
  }

  //db actions
  async init() {
    var res = await db.run(this.getCreateSql());

    if (this.uniqueKey) {
      var uniqueEntryExist = await db.all(
        "select id from " + this.name + "  limit 1"
      );
      if (!uniqueEntryExist.length) db.run(this.uniqueKeyStr);
    }
  }

  async insert(elem) {
    if (this.uniqueKey)
      assert("it'a a unique key table: insert on " + this.name);
    const e = this.attr.map(attr => {
      return attr.wrapper(elem[attr.name], elem);
    });
    e.unshift(await this.getIndexInsert());
    const res = await db.run(this.STRINSERT, e);

    return await db.get(
      "select * from " + this.name + " order by id desc limit 1"
    );
  }

  async update(id, attr, value) {
    var elem = await this.get(id);
    if (!elem) return { error: "entry not found" };

    await db.run(
      "update " +
        this.name +
        " set " +
        this.dict[attr].getUpdateStr(attr, value) +
        " where id = ?",
      [id]
    );
    elem[attr] = this.dict[attr].decode(value);
    return elem;
  }

  async set(attrSelect, valueSelect, attr, value) {
    console.log(attrSelect, valueSelect, attr, value);
    await db.run("update ? set ? = ? where ? = ?", [
      this.name,
      attr,
      value,
      attrSelect,
      valueSelect
    ]);
  }

  async get(value, attr = "id") {
    var myObj = await db.get(`select * from ${this.name} where ? = ?`, [
      attr,
      value
    ]);
    if (!myObj) return myObj;
    for (var i = 0; i < this.relationSql.length; i++) {
      var relation = this.relationSql[i];
      var relationObj = await db.all(relation.sql + value);
      myObj[relation.attr] = relation.model.decodeCollection(relationObj);
    }
    return myObj ? this.decodeObject(myObj) : null;
  }

  async getAll(filter, sort) {
    var filterStr = "";
    var sortStr = "";
    if (filter) {
      //add the wrapper

      filterStr =
        " where " +
        filter
          .map(f => {
            var value = this.dict[f[0]].wrapper(f[1]);
            return f[0] + " = " + value;
          })
          .join(" and ");
    }
    if (sort) {
      sortStr = " order by " + sort.map(f => f[0]).join(", ");
    }
    var collection = await db.all(
      "select * from " + this.name + filterStr + sortStr,
      []
    );
    if (collection.error) {
      console.error(collection);
      return { error: "database error" };
    }
    return this.decodeCollection(collection);
  }

  async delete(id) {
    return await db.run("delete from " + this.name + " where id = '?'", [id]);
  }

  //parsing actions
  decodeObject(obj) {
    Object.keys(obj).map(k => {
      if (this.dict[k]) obj[k] = this.dict[k].decode(obj[k]);
    });
    return obj;
  }

  decodeCollection(col) {
    return col.map(e => this.decodeObject(e));
  }

  async checkTable() {
    var scheme = await db.run("schema " + this.name);
    var sentences = scheme
      .replace("(", ",")
      .replace(/[\(\)\n\t;]/g, " ")
      .split(",");
    var name = sentences.splice(0, 1);

    sentences = sentences.map(instr => {
      return instr.split(" ").filter(e => e);
    });

    var controllerScheme = this.getCreateStr();
    controllerScheme = controllerScheme
      .replace("(", ",")
      .replace(/[\(\)\n\t;]/g, " ")
      .split(",");
    var nameController = controllerScheme.splice(0, 1);
    controllerScheme = controllerScheme.map(instr => {
      return instr.split(" ").filter(e => e);
    });

    //check name table
    controllerScheme.forEach((attribute, j) => {
      attribute.forEach((keyword, i) => {
        if (keyword != sentences[j][i])
          console.log(
            "difference between " + keyword + " and " + sentences[j][i]
          );
      });
    });
  }

  async search(attribute, token) {
    var sql =
      `select * from ${this.name} where ` + attribute.getSearchSql(token);

    var result = await db.all(sql);
    return result;
  }
}

module.exports = Controller;
