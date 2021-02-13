const { param } = require("jquery");
const Attr = require("./attr");
/*
class Scheme extends Attr {
  constructor(params) {
    super({
      name: param.name,
      update: param.update
    });
    this.name = params.name;
    this.attr = params.attr;
  }

  getAttrs() {
    return this.attr;
  }

  getCreateStr() {
    console.warn("create str of children was call");
    //on va creer une create str sur plusieurs lignes

    return Object.values(this.attr)
      .map(attr => {
        return attr.createInsertStr();
      })
      .join(",\n");
  }

  getUpdateStr(attr, value) {
    this.attr.map(attribute => attribute.getUpdateStr());
    //return the sql str for update the scheme
  }

  //checker()
  //parser()
  //wrapper()
  //decode()
  //beforeUpdate()
  //afterUpdate()

  async updateAttr(controller, params) {
    var keys = Object.keys(params.value);
    Promise.all(
      keys.map(async keyAttr => {
        let paramsAttr = {
          id: params.id,
          attr: this.attr[keyAttr].name, //get the real name of attr
          value: params.value[keyAttr] //get value of attr
        };
        await this.attr[key].updateAttr(controller, paramsAttr);
      })
    );
  }
}
*/
//x -> update table set anchorX = $x, anchorY = $y where id = ?
//l'attribut precise l'anchorX et anchorY

//on ajoute aux attribut la str

class Scheme {
  constructor(params) {
    this.attr = params.attr;
    this.name = params.name;
  }
}

module.exports = Scheme;
