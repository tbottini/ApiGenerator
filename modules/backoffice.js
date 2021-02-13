const fs = require("fs");

function generateBackofficePage(model) {
  fs.writeFileSync(
    `./pages/admin/manage/${model.name}.vue`,
    `<template>
    <div>
      <PageBackoffice
        v-if="backoffice"
        :name="name"
        :fields="backoffice.fields"
        :xtitle="backoffice.xtitle"
        :url="backoffice.url"
        :addFields="backoffice.inputs"
        :uniqueEntry="backoffice.uniqueEntry"
        :xtitlePos="backoffice.xtitlePos"
      />
    </div>
  </template>
  <script>
  export default {
    data() {
  
      return {
        backoffice: ${JSON.stringify(model.conf, null, "\t").replace(
          /"([^"]+)":/g,
          "$1:"
        )},
        name: "${model.name}"
      };
    }
  };
  </script>
  `
  );
}

export default function Backoffice(moduleOptions) {
  var options = this.options.backoffice;

  var modelPath = this.options.modelsPath || "../../models/"

  var modelObject = [];

  options.tables.forEach(model => {
    modelObject.push({
      name: model.namePrint || model.name,
      conf: require(modelPath + model.name + ".js").getBackoffice()
    });
  });

  modelObject.forEach(model => {
    generateBackofficePage(model);
  });

  this.nuxt.hook("ready", async nuxt => {
    console.log("- Backoffice generate");
  });
}
