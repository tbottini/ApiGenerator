//const { backoffice } = require("../model/config");

const DEBUG = true;

class Backoffice {
  constructor({ name, attr, uniqueKey, conf, relation }) {
    this.name = name;
    this.attr = attr;
    this.uniqueKey = uniqueKey;
    this.conf = conf || {};
    if (DEBUG) {
      this.log(conf?.table);
    }
    this.confTable = this.conf?.table;
    this.relation = relation || [];
  }

  translateRelationsToAttributes() {
    return this.relation.map(rel => {
      return {
        name: rel.attr_name || rel.table_get,
        type: "relation-" + rel.link,
        extra: { ...rel }
      };
    });
  }

  parseConfAttr(confAttr) {
    if (typeof confAttr == "string") return { namePrint: confAttr };
    if (!confAttr) return {};

    confAttr.namePrint = confAttr.namePrint || confAttr.backoffice;
    return confAttr;
  }

  mergeConf(modelConf, backofficeConf) {
    const extra = { ...modelConf.extra, ...backofficeConf.extra };

    const merge = { ...modelConf, ...backofficeConf };

    merge.namePrint = merge.namePrint || merge.name;
    merge.type = backofficeConf.type || modelConf.type;
    merge.xtitle = merge.xtitle || false;
    merge.inputsAdd = merge.required;
    merge.extra = extra;

    return merge;
  }

  generateAttributes() {
    var relationAttr = this.translateRelationsToAttributes();

    var attr = this.attr.filter(a => a.update).concat(relationAttr);

    attr = attr
      .map(attribute => {
        var conf = this.parseConfAttr(this.conf[attribute.name]);
        if (conf?.show == false) return null;
        //replace if exist value of attribute by conf value;

        conf = this.mergeConf(attribute, conf);

        return conf;
      })
      .filter(a => a);

    return attr;
  }

  generateXtitles(attr) {
    return attr.map(a => ({
      name: a.name,
      namePrint: a.namePrint,
      active: a.xtitle,
      required: a.required
    }));
  }

  /*
   * generate input for create an element in table
   */
  generateInput() {
    return this.attr
      .filter(a => a.required)
      .map(a => {
        return {
          attr: a.name,
          type: a.type,
          namePrint: a.namePrint,
        };
      });
  }

  generateBackofficeConf() {
    var attr = this.generateAttributes();

    var xtitles = this.generateXtitles(attr);
    //const xtitlePos = this.generateXtitlesPos(attr);

    const inputs = this.generateInput();

    this.log(attr);

    return {
      inputs: inputs,
      url: this.name,
      attributes: attr,
      uniqueEntry: this.uniqueKey,
      xtitles: xtitles,
      index: this.confTable?.index,
      reverseIndex: this.confTable?.reverseIndex,
      namePrint: this.confTable?.namePrint || this.name
    };
  }

  log(msg) {
    console.log("Backoffice - " + this.name + " - ", msg);
  }
}

module.exports = Backoffice;
