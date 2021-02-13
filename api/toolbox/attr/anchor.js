const Scheme = require("../scheme");
const Int = require("./int");

class Anchor extends Scheme {
  constructor(params) {
    super({
      name: params.name,
      attr: [
        new Int({ name: params.name + "X", update: params.update }),
        new Int({ name: params.name + "Y", update: params.update })
      ]
    });
  }
}

module.exports = Anchor;
