const Attr = require("../attr");
const parse = require("../parse/parser");
const ERROR = require("../parse/error");
const hash = require("../parse/hash.js");

class Password extends Attr {
  constructor(param) {
    var type = "password";
    var variableSql = "varchar";
    super({
      name: param.name,
      type: type,
      private: param.private,
      update: param.update,
      filter: param.filter,
      notnull: param.notnull,
      variableSql: variableSql,
      required: param.required
    });
  }

  async parse(value) {
    if (!parse.checkPassword(value)) return ERROR.formatpassword;
    return await hash.hash(value);
  }

  async setterParse(value, controller, id) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      console.log(e);
      return { error: "bad format of new password" };
    }
    if (!value.newPassword || !value.currentPassword || !id)
      return ERROR.uncomplete;
    var user = await controller.get(id);
    console.log(value.currentPassword);
    if (!(await hash.verify(user.password, value.currentPassword)))
      return { error: "password doesnt correspond" };
    if (!parse.checkPassword(value.newPassword))
      return res.json(ERROR.formatpassword);
    var newPassword = await hash.hash(value.newPassword);
    return newPassword;
  }

  wrapper(value) {
    return `'${value || ""}'`;
  }

  async afterUpdate(req, params, controller) {
    if (this.isVideoAttr)
      await this.setIsVideo(req, params, controller, this.isVideoAttr);
  }
}

module.exports = Password;
