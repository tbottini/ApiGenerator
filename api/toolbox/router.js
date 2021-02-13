const ERROR = require("./error");
const parse = require("./parser");
var file = require("./file.js");
const upload = file.upload;
const fs = require("fs");
const ExpressRouter = require("express").Router;

const DEBUG = false;

class Router {
  constructor({
    name,
    attr,
    controller,
    uniqueKey,
    privateGetter,
    videoGetter,
    beforePost,
    debug
  }) {
    this.name = name;

    if (debug) DEBUG = debug;

    if (DEBUG) {
      console.log("### Router " + this.name, attr);
    }
    if (Array.isArray(attr)) {
      var dictAttribute = {};
      attr.forEach(attribute => (dictAttribute[attribute.name] = attribute));
      this.attr = dictAttribute;
    } else this.attr = attr;

    this.controller = controller;
    this.beforePost = beforePost;
    this.router = new ExpressRouter();

    this.activePrivateGetter = privateGetter;
    this.activeVideoGetter = videoGetter;
    this.uniqueKey = uniqueKey;

    this.required = attr
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
    if (this.activePrivateGetter) this.privateGetter();
    else this.privatePost();
    Object.values(this.attr).forEach(attr => {
      if (attr.extraRoute) attr.extraRoute(this.router, this.controller);
    });
    if (!this.uniqueKey) {
      this.postRoute();
      this.searchRoute();
    }
    this.setterRoute();
    if (this.uniqueKey) this.getterUniqueKey();
    else this.getterRoute();
    if (this.activeVideoGetter) this.videoGetter();
    if (!this.uniqueKey) this.deleteRoute();
  }

  postRoute() {
    //!TODO to modify
    this.router.post(
      "/post",
      upload.fields(this.getFieldsMulter()),
      async (req, res) => {
        Object.entries(req.files).forEach(file => {
          req.body[file[0]] = file[1][0];
        });

        var insertValues = {};
        var values = Object.entries(req.body);
        for (var i = 0; i < values.length; i++) {
          const [key, value] = values[i];
          var attr = this.attr[key];
          if (!attr) return res.json(ERROR.uncomplete);

          insertValues[key] = await attr.parse(value);

          if (insertValues[key].error) return res.json(insertValues[key]);
        }

        var status = await this.controller.insert(insertValues);
        return res.json(status);
      }
    );
  }

  setterRoute() {
    const ROUTESETTER = "/set" + (this.uniqueKey ? "" : "/:id");
    //route for non unique key model
    this.router.post(ROUTESETTER, upload.single("value"), async (req, res) => {
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

      params.value = await attribute.parse(req.body.value);

      if (params.value.error) return res.json(params.value);

      params.id = this.uniqueKey ? "1" : parse.secureSql(req.params.id);

      var status = await attribute.updateAttr(this.controller, params);

      if (attribute.afterUpdate)
        await attribute.afterUpdate(req, params, this.controller);

      return res.json(status);
    });
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

  getterRoute() {
    this.router
      .get("/", async (req, res) => {
        var params = Object.entries(req.query);

        if (params.length) {
          if (this.getUnkown(params).length)
            return res.json({ error: "bad params" });

          var filter = await this.getFilter(params);
          var sort = this.getSort(params);
        }

        return res.json(await this.controller.getAll(filter, sort));
      })
      .get("/:id", async (req, res) => {
        var id = parse.secureSql(req.params.id);
        return res.json(await this.controller.get(id));
      });
  }

  getterUniqueKey() {
    this.router.get("/", async (req, res) => {
      return res.json(await this.controller.get("1"));
    });
  }

  privateGetter() {
    this.router.use((req, res, next) => {
      if (!req.session.is_admin) return res.json(ERROR.adminRight);
      next();
    });
    return this;
  }

  videoGetter() {
    this.router.get("/video/:path", async (req, res) => {
      if (!req.params.path) return res.status(404).json(ERROR.uncomplete);
      const path = "./public/video/" + req.params.path;
      fs.stat(path, (err, stat) => {
        // Handle file not found
        if (err !== null && err.code === "ENOENT") {
          return res.sendStatus(404);
        }

        const fileSize = stat.size;
        const range = req.headers.range; //the part request of the vidéo

        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          //split parts to table [start, end]

          const start = parseInt(parts[0], 10); //parse String to int base 10
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          const chunksize = end - start + 1;
          const file = fs.createReadStream(path, { start, end });
          const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
          };

          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4"
          };

          res.writeHead(200, head);
          fs.createReadStream(path).pipe(res);
        }
      });
    });
  }

  deleteRoute() {
    this.router.get("/del/:id", async (req, res) => {
      var id = parse.secureSql(req.params.id);
      return res.json(await this.controller.delete(id));
    });
  }

  privatePost() {
    this.router.post("*", (req, res, next) => {
      if (!req.session.is_admin) return res.json(ERROR.adminRight);
      next();
    });
  }

  async search(req, res) {
    console.log(req.params);
    var { attr, token } = req.params;

    var attribute = this.attr[attr];
    if (!attribute) return res.json(ERROR.attrUnexist(attr));
    if (!attribute.search)
      return res.json({ error: "cant research data with this attribute" });
    var result = await this.controller.search(attribute, token);
    res.json(result);
  }

  searchRoute() {
    this.router.get("/:attr/search/:token", (req, res) =>
      this.search(req, res)
    );
    this.router.get("/:attr/:token", (req, res) => this.search(req, res));
  }
}

module.exports = Router;
