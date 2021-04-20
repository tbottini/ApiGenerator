const Attr = require("../attr");
const parse = require("../parse/parser");
var file = require("../parse/file.js");
const ERROR = require("../parse/error");

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

    if (!param.extension)
      console.warn(this.name + " -  no extension provided, default : jpg");

    this.directory = param.directory || "image";
    this.extension = param.extension || "jpg";
    this.isVideoAttr = param.isVideoAttr;
  }

  async parse(value) {
    if (!value) return ERROR.fileMissing;
    return await this.saveFile(value);
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

  async saveFile(f) {
    var isVideo = f.mimetype.split("/")[0] == "video";
    var path = await file.save(f.buffer, this.directory + "/", this.extension);
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
