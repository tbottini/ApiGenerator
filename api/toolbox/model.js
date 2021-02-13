const Controller = require("./controller");
const Router = require("./router");
const Backoffice = require("./backoffice");
const assert = require("assert");

const DEBUG = false;

class Model {
  constructor(parameters) {
    this.debug = parameters.debug || DEBUG;
    this.debug = false;

    this.checkParams(parameters, "name");
    this.checkParams(parameters, "attr");

    this.name = parameters.name;
    this.attr = this.inflate(parameters.attr);
    this.uniqueKey = parameters.uniqueKey;

    this.backoffice = new Backoffice({
      name: this.name,
      attr: this.attr,
      conf: parameters.backoffice,
      uniqueKey: this.uniqueKey,
      relation: parameters.relation
    });

    this.controller = new Controller({
      name: this.name,
      attr: this.attr,
      uniqueKey: this.uniqueKey,
      relation: parameters.relation
    });

    this.controller.init();

    this.router = new Router({
      name: this.name,
      attr: this.attr,
      controller: this.controller,

      uniqueKey: this.uniqueKey,
      privateGetter: parameters.privateGetter,
      videoGetter: parameters.videoGetter,

      beforePost: parameters.beforePost
    });

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
    console.log("Model " + this.name + ":");
    this.attr.forEach(a => a.print());
    console.log("\n");
  }

  activeController() {
    this.controller.linkRelation();
  }

  activeRouter() {
    console.error("active router function isnt defined");
  }
}

module.exports = Model;
