const Controller = require("./controllerClass/controller");
const Router = require("./routerClass/router");
const Backoffice = require("./backoffice");
const assert = require("assert");

const DEBUG = false;

class Model {
  constructor(parameters) {
    this.debug = parameters.debug || DEBUG;
    this.debug = false;
    this.private = parameters.private;

    this.checkParams(parameters, "name");
    this.checkParams(parameters, "attr");

    this.name = parameters.name;
    this.attr = this.inflate(parameters.attr);
    this.uniqueKey = parameters.uniqueKey;

    var dictRelation = {};
    parameters.relation?.forEach(rel => (dictRelation[rel.table_get] = rel));

    this.backoffice = new Backoffice({
      name: this.name,
      attr: this.attr,
      conf: parameters.backoffice,
      uniqueKey: this.uniqueKey,
      relation: parameters.relation
    });

    const controllerParameter = {
      name: this.name,
      attr: this.attr,
      uniqueKey: this.uniqueKey,
      relation: parameters.relation,
      dictRelation: dictRelation
    };

    if (!parameters.Controller)
      this.controller = new Controller(controllerParameter);
    else this.controller = new parameters.Controller(controllerParameter);

    this.controller.init();

    const routerParameters = {
      name: this.name,
      attr: this.attr,
      controller: this.controller,
      private: this.private,
      uniqueKey: this.uniqueKey,
      privateGetter: parameters.privateGetter,
      videoGetter: parameters.videoGetter,
      routerExtra: parameters.routerExtra,
      beforePost: parameters.beforePost,
      noInsert: parameters.router?.noInsert || false,
      relation: dictRelation,
      afterInsert: parameters.router?.afterInsert
    };

    if (!parameters.Router) this.router = new Router(routerParameters);
    else this.router = new parameters.Router(routerParameters);

    if (this.debug) {
      this.print();
    }
  }

  checkParams(p, a) {
    if (!p[a]) return assert(p[a] + " is missing");
  }

  getController() {
    return this.controller;
  }

  getRouter() {
    return this.router.getRouter();
  }

  getBackoffice() {
    return this.backoffice.generateBackofficeConf();
  }

  //trad scheme to attr
  inflate(attributes) {
    var attr = [];
    attributes.forEach(attribute => {
      if (attribute.attr && Array.isArray(attribute.attr)) {
        attr = attr.concat(attribute.attr);
      } else {
        attr.push(attribute);
      }
    });
    return attr;
  }

  print() {
    this.log("");
    this.attr.forEach(a => a.print());
  }

  log(msg) {
    console.log("Model " + this.name + ": " + msg);
  }

  activeController() {
    this.controller.linkRelation();
  }

  activeRouter() {
    console.error("active router function isnt defined");
  }

  post(path, callback) {
    console.debug("implement of post addition route");
  }
}

module.exports = Model;
