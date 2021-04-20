const Model = require("../model");
const UserController = require("../controller/usersController");

class UserModel extends Model {
  constructor(param) {
    param.Controller = UserController;

    super(param);
  }
}

module.exports = UserModel;
