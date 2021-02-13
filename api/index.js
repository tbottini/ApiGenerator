const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();

const Config = require("@lib/config");

const config = new Config(require("@api/config"));


//Router
//const routerUser = require("./router/users.js");

/* TODO move to model part parse */

const glob = require("glob");
const path = require("path");

var models = [];


function implementRouter(app, conf) {
  var routerFilenames = glob
    .sync(config.modelsPath + "/*.js")
    .map(filename => path.basename(filename));

  routerFilenames.forEach(router => {
    if (!conf[router])
      router = {
        name: router,
        path: router,
        suffix: router
      };
    else router = conf[router];

    var routerModel = require(`@models/${router.name}`);

    try {
      var routerObject = routerModel.getRouter();
      models.push(routerModel);

      console.log(routerModel.name + "  -> /api/" + routerModel.name);
      app.use(`/${routerModel.name}`, routerObject);
    } catch (e) {
      console.warn(router.name, " wrong model object > can't generate router");
      //console.log(e);
    }
  });

  //activeController();

  models.forEach(model => {
    model.activeController();
  });
}
/* *** */

var app = express();

app
  .use("/static", express.static("public"))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(
    session({
      secret: "lichen-session",
      saveUninitialized: true,
      store: new RedisStore({ client: redisClient }),
      resave: true,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 8,
        httpOnly: false,
        sameSite: "lax"
      }
    })
  )
  .use((req, res, next) => {
    console.log("PAGE " + req.url);
    console.log(req.body);
    next();
  });


implementRouter(app, config.router);

app.use((req, res) => {
  res.status(404).json("PAGE " + req.url + " unexist");
});

module.exports = app;
