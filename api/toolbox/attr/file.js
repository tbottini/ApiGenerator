const Attr = require("../attr");
const parse = require("../parser");
var file = require("../file.js");
const ERROR = require("../error");

class File extends Attr {
  constructor(param) {
    var type = "file";
    var variableSql = "varchar(200)";
    super({
      name: param.name,
      type: type,
      update: param.update,
      filter: param.filter,
      notnull: param.notnull,
      variableSql: variableSql,
      required: param.required
    });

    this.isVideoAttr = param.isVideoAttr;
  }

  async parse(value) {
    if (!value) return ERROR.fileMissing;
    console.log("value", value);
    return await this.saveImage(value);
  }

  wrapper(value) {
    return `'${value || ""}'`;
  }

  decode(value) {
    return parse.decode(value);
  }

  async afterUpdate(req, params, controller) {
    if (this.isVideoAttr)
      await this.setIsVideo(req, params, controller, this.isVideoAttr);
  }

  async saveImage(f) {
    var isVideo = f.mimetype.split("/")[0] == "video";
    var path = await file.save(f.buffer, isVideo ? "video/" : "image/");
    return parse.secureSql(path);
  }

  async setIsVideo(req, params, controller, attrName) {
    await controller.update(
      params.id,
      attrName,
      req.file.mimetype.split("/")[0] == "video"
    );
  }

  //add before post
  //before update and post -> parser + function in router

  //checker --> parse file and put in param
  //parsing --> check if is a video with mime

  //
}

module.exports = File;
