const ERROR = require("../parse/error");
const parse = require("../parse/parser");
var file = require("../parse/file.js");
const upload = file.upload;
const ExpressRouter = require("express").Router;

const DEBUG = false;

class Router {
  constructor(param) {
    this.name = param.name;

    if (param.debug) DEBUG = param.debug;

    if (DEBUG) {
      console.log("### Router " + this.name, param.attr);
    }

    var dict = {};
    param.attr.forEach(attributes => (dict[attributes.name] = attributes));
    this.attr = dict;

    this.relation = param.relation;
    this.controller = param.controller;
    this.router = new ExpressRouter();
    this.activePrivateGetter = param.privateGetter;
    this.activeVideoGetter = param.videoGetter;
    this.uniqueKey = param.uniqueKey;
    this.private = param.privateGetter;
    this.routerExtra = param.routerExtra;
    this.noInsert = param.noInsert;
    this.afterInsert = param.afterInsert;

    this.required = param.attr
      .filter(attribute => attribute.required)
      .map(elem => elem.name);

    this.uploadReceiver = upload.fields(
      Object.entries(this.attr)
        .filter(e => e[1].type == "file")
        .map(e => {
          return { name: e[0], maxCount: 1 };
        })
    );

    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {
    this.routerExtra?.forEach(ext => {
      this.router[ext.method](ext.path, ext.fct);
    });

    if (this.private) {
      console.log(this.name + " active private route");
      this.privateGet();
      this.setterSelf();
      this.postRoute();
      this.setterRoute();
      this.getterRoute();
      return;
    } else if (this.uniqueKey) {
      this.getterUniqueKey();
      this.setterRoute();
      return;
    }
    Object.values(this.attr).forEach(attr => {
      if (attr.extraRoute) attr.extraRoute(this.router, this.controller);
    });
    this.postRoute();
    this.deleteRoute();
    this.searchRoute();
    this.setterRoute();
    this.getterRoute();
    if (this.activeVideoGetter) this.videoGetter();
  }

  async insert(req, res) {
    //admin right is check below in privatePost()
    console.log(this.name + " / create");

    if (req.files)
      Object.entries(req.files).forEach(file => {
        req.body[file[0]] = file[1][0];
      });

    const insertValues = await this.checkRequiredParameters(req.body);
    if (insertValues.error) return res.json(insertValues);

    console.log(insertValues);

    var status = await this.controller.insert(insertValues);

    if (this.afterInsert && !status.error) this.afterInsert(status);

    return res.json(status);
  }

  //check
  async checkRequiredParameters(body) {
    var insertValues = {};
    var values = Object.entries(body);
    for (var i = 0; i < values.length; i++) {
      const [key, value] = values[i];
      var attr = this.attr[key];
      /*if (!attr) { warning: key + " attribute doesnt exist" };*/

      if (attr) {
        insertValues[key] = await attr.parse(value);

        if (insertValues[key].error) return { error: insertValues[key] };
      }
    }
    return insertValues;
  }

  postRoute() {
    if (this.noInsert) return;
    //!TODO to modify
    this.router.post(
      "/post",
      upload.fields(this.getFieldsMulter()),
      async (req, res) => this.insert(req, res)
    );
  }

  async setter(req, res) {
    if (!req.session.is_admin && req.session.id_user != req.params.id)
      return res.json(ERROR.adminRight);

    if (req.file) {
      req.body.value = req.file;
    }
    console.log(req.body);

    var params = {};
    params.attr = parse.secureSql(req.body.attr);

    const attribute = this.attr[params.attr];

    //checker of router
    if (!req.params.id && !this.uniqueKey) return res.json(ERROR.idMissing);
    if (!attribute) return res.json(ERROR.attrUnexist(params.attr));
    if (!attribute.update) return res.json(ERROR.attrRight);

    params.value = attribute.setterParse
      ? await attribute.setterParse(
          req.body.value,
          this.controller,
          req.params.id
        )
      : await attribute.parse(req.body.value);
    if (params.value.error) return res.json(params.value);

    params.id = this.uniqueKey ? "1" : parse.secureSql(req.params.id);

    var status = await attribute.updateAttr(this.controller, params);

    if (attribute.afterUpdate)
      await attribute.afterUpdate(req, params, this.controller);

    return res.json(status);
  }

  //TODO move on subclass user router
  setterSelf() {
    const ROUTESETTER = "/set";

    this.router.post(ROUTESETTER, upload.single("value"), async (req, res) => {
      req.params.id = req.session.id_user;
      return this.setter(req, res);
    });
  }

  setterRoute() {
    const ROUTESETTER = "/set" + (this.uniqueKey ? "" : "/:id");

    //route for non unique key model
    this.router.post(ROUTESETTER, upload.single("value"), (req, res) =>
      this.setter(req, res)
    );
  }

  getFieldsMulter() {
    //check file attribute
    var values = Object.entries(this.attr);

    return values
      .filter(a => {
        return a[1].type == "file";
      })
      .map(a => {
        return {
          name: a[1].name,
          maxCount: 1
        };
      });
  }

  getSort(elem) {
    var sort = elem.filter(attrFilter => {
      return this.attr[attrFilter[0]].sort;
    });
    return sort.length ? sort : null;
  }

  async getFilter(elem) {
    var filter = await elem.filter(attrFilter => {
      return this.attr[attrFilter[0]].filter;
    });
    for (var i = 0; i < filter.length; i++) {
      filter[i][1] = await this.attr[filter[i][0]].parse(filter[i][1]);
    }
    return filter.length ? filter : null;
  }

  getUnkown(elem) {
    return elem.filter(attr => !this.attr[attr[0]]);
  }

  async parseQuery(query) {
    var params = Object.entries(query);

    if (params.length) {
      if (this.getUnkown(params).length) return { error: "unknow parameter" };

      var filter = await this.getFilter(params);
      console.log("filter", filter);
      var sort = this.getSort(params);
    }

    return {
      sort,
      filter
    };
  }

  getterRoute() {
    this.router
      .get("/", async (req, res) => {
        var params = await this.parseQuery(req.query);
        if (params.error) return res.json(params);

        return res.json(
          await this.controller.getAll(params.filter, params.sort)
        );
      })

      .get("/:id", async (req, res) => {
        if (!/^[0-9]*$/.test(req.params.id)) {
          //on recherche un attribut/relation

          const relation = this.relation[req.params.id];
          console.log(this.relation);
          if (!relation) return res.json({ error: "bad token provide" });

          var params = await this.parseQuery(req.query);
          if (params.error) return res.json(params);

          return res.json(
            await this.controller.getAll(
              params.filter,
              params.sort,
              null,
              relation
            )
          );
        }

        var id = parse.secureSql(req.params.id);
        console.log("id", id);
        return res.json(await this.controller.get(id));
      });
  }

  getterUniqueKey() {
    this.router.get("/", async (req, res) => {
      return res.json(await this.controller.get("1"));
    });
  }

  privateAll() {
    this.router.use((req, res, next) => {
      if (!req.session.is_admin) return res.json(ERROR.adminRight);
      next();
    });
    return this;
  }

  deleteRoute() {
    this.router.get("/del/:id", async (req, res) => {
      if (!req.session.is_admin) return res.json(ERROR.adminRight);
      var id = parse.secureSql(req.params.id);
      return res.json(await this.controller.delete(id));
    });
  }

  privateGet() {
    this.router.get("*", (req, res, next) => {
      console.log("admin right : ", req.session.is_admin);
      if (!req.session.is_admin) return res.json(ERROR.adminRight);
      next();
    });
  }

  /*
   * wille parse incomming url and provide collection of items corresponding to the token
   */
  async search(req, res) {
    this.log(req.params.attr + " " + req.params.token);
  
    var { attr, token } = req.params;

    var attribute = this.attr[attr];
    if (!attribute) return res.json(ERROR.attrUnexist(attr));
    if (!attribute.search)
      return res.json({ error: "cant research data with this attribute" });
    const tokenEncode = await attribute.parse(token);
    if (tokenEncode.error)
      return res.json(tokenEncode);
    var result = await this.controller.search(attribute, tokenEncode);
    res.json(result);
  }

  searchRoute() {
    this.router.get("/:attr/search/:token", (req, res) =>
      this.search(req, res)
    );
    this.router.get("/:attr/:token", (req, res) => this.search(req, res));
  }

  get(path, callback) {
    this.router.get(path, callback);
  }

  post(path, callback) {
    this.router.post(path, callback);
  }

  log(msg)
  {
    if (DEBUG)
      console.log("ROUTER(" + this.name + "): ", msg);
  }
}

module.exports = Router;
