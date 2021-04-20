const Application = require("./srcs/application");

module.exports = new Application({
  name: "Éditions Bruno Doucey",
  database: "postgresql",
  config: {
    database: "test"
  }
});
