const assert = require("assert");

class Backoffice {
  constructor({ name, attr, uniqueKey, conf, relation }) {
    this.name = name;
    this.attr = attr;
    this.uniqueKey = uniqueKey;
    this.conf = conf || {};
    this.relation = relation || [];
  }

  generateAttribute() {
    var relationAttr = this.relation.map(rel => {
      return {
        name: rel.table_get,
        type: "relation-" + rel.link,
        extra: { ...rel }
      };
    });

    var attr = this.attr.filter(a => a.update).concat(relationAttr);
    attr = attr.map(a => {
      const confAttr = this.conf[a.name];

      if (confAttr) {
        var xtitle = confAttr.xtitle || false;
        var namePrint = confAttr.backoffice || a.name;
      } else {
        var xtitle = false;
        var namePrint = a.name;
      }
      return {
        name: a.name,
        type: a.type,
        namePrint: namePrint,
        xtitle: xtitle,
        inputsAdd: a.required,
        extra: a.extra
      };
    });

    return attr;
  }

  generateXtitles(attr) {
    var xtitles = attr.filter(a => a.xtitles).map(a => a.name);

    if (!xtitles.length) {
      xtitles = attr.slice(0, 3).map(a => a.name);
    }
    return xtitles;
  }

  generateXtitlesPos(attr) {
    return attr.map(attribute => attribute.name);
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
          type: a.type
        };
      });
  }

  generateBackofficeConf() {
    var attr = this.generateAttribute();
    var xtitle = this.generateXtitles(attr);
    const xtitlePos = this.generateXtitlesPos(attr);

    const inputs = this.generateInput();

    return {
      inputs: inputs,
      xtitle: xtitle,
      url: "/" + this.name,
      fields: {
        section: this.name,
        attr: attr
      },
      uniqueEntry: this.uniqueKey,
      xtitlePos: xtitlePos
    };
  }
}

module.exports = Backoffice;
