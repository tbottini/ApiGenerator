const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();
require("dotenv").config();
const { createIPX, createIPXMiddleware } = require("ipx");
const ipx = createIPX();
const path = require("path");

const Application = require("./srcs/application");

console.log("NODE_ENV : ", process.env.NODE_ENV);

/*
function checkVar()
{

const {
  //STRIPE_KEY,
  //STRIPE_PUBKEY,
  //EMAIL_ADMIN,
  //EMAIL_DEV,
  //CONTACT_MAIL,
  //SENDER_MAIL,
  //SENDER_MAIL_PSW
} = process.env;
if (
  !STRIPE_KEY ||
  !STRIPE_PUBKEY ||
  !EMAIL_ADMIN ||
  !EMAIL_DEV ||
  !CONTACT_MAIL ||
  !SENDER_MAIL ||
  !SENDER_MAIL_PSW
) {
  console.error(".env variable not defined");
  return 1;
}
}
*/

class ApiGenerator {
  _app;

  constructor({ dirModel, database, name }) {
    if (database == null || database.name == null)
      return console.error("no database attribute was provide");
    if (name == null)
      console.warn("ApiGenerator : name attribute isn't provide");

    this._app = express();

    this.configureMiddleware();

    this.internApp = new Application({
      name: name,
      database: database.type || "postgresql",
      config: {
        database: database.name
      },
      app: this._app
    });

    dirModel = path.resolve(dirModel);

    this.internApp.active(dirModel);
    this._app.use((req, res) => {
      res.status(404).json("PAGE " + req.url + " unexist");
    });
  }

  configureMiddleware() {
    this._app
      .enable("trust proxy")
      .use("/_ipx", createIPXMiddleware(ipx))
      .use("/static", express.static("static"))
      .use(bodyParser.urlencoded({ extended: false }))
      .use(bodyParser.json())
      .use(
        session({
          secret: "lichen-session",
          saveUninitialized: true,
          proxy: process.env.NODE_ENV == "production",
          store: new RedisStore({ client: redisClient }),
          resave: true,
          cookie: {
            secure: process.env.NODE_ENV == "production",

            maxAge: 1000 * 60 * 60 * 8,
            httpOnly: false
          }
        })
      )
      .use((req, res, next) => {
        console.log("PAGE " + req.url);
        console.log(req.body);
        next();
      });
  }

  getApi() {
    return this._app;
  }

  listen(port) {
    console.log("Api: listen on port " + port);
    this._app.listen(port);
  }
}

module.exports = ApiGenerator;
