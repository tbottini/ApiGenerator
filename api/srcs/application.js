"use strict";
const glob = require("glob");
const path = require("path");

/**
 * handles different models
 */
class Application {
  constructor({ database = "sqlite", config, app, name }) {
    const DatabaseController = require("./database/" + database);

    this.db = new DatabaseController(config);
    this.app = app;
    this.models = [];
    this.routers = [];
    this.name = name;

    this.init();

    console.log("Api ", this.name, " was created ", process.env.NODE_ENV);
  }

  attachAppExpress(app) {
    this.app = app;
  }

  getRouters() {
    return this.routers;
  }

  getModels() {
    return this.models;
  }

  getApp() {
    return this.app;
  }

  init() {}

  getDatabase() {
    return this.db;
  }

  activeRouter(conf, modelPath) {
    this.implementRouter(conf, modelPath);
  }

  activeController() {
    this.models.forEach(model => {
      model.activeController();
    });
  }

  //search and get router in special folders
  implementRouter(conf, dirname) {
    if (!dirname) dirname = "./models/";
    if (dirname[dirname.length - 1] != "/") dirname += "/";
    dirname += "*.js";

    console.log(dirname);
    console.log(glob.sync(dirname));

    glob.sync(dirname).forEach(filename => {
      /*if (!conf[router])
          router = {
            name: router,
            path: router,
            suffix: router
          };
        else router = conf[router];*/

      //console.log(router.name);
      var model = require(filename);
      const name = path.basename(filename);

      try {
        var router = model.getRouter();
        this.models.push(model);

        this.app.use(`/${name}`, router);
      } catch (e) {
        console.warn(name, " wrong model object > can't generate router");
        //console.log(e);
      }
    });
  }
}

module.exports = Application;
