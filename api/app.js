const Application = require("./toolbox/application");
const config = require("@api/config").database;

module.exports = new Application({
  database: config.model,
  config: {
    database: config.name,
  }
});
