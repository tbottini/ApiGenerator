class Application {
  constructor({ database = "sqlite", config }) {
    const DatabaseController = require("./" + database);

    this.db = new DatabaseController(config);
  }

  getDatabase() {
    return this.db;
  }

  load() {
    //load models
    //active routers
  }

  link() {
    //active controller
  }
}

module.exports = Application;
