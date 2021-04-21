const fs = require("fs");
const path = require("path");

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

  if (options == null) return;

  console.log(options);

  const DEFAULT_PATH = "./api/models/";

  const modelPath = path.resolve(options.modelsPath || DEFAULT_PATH) + "/";
  var modelObject = [];

  modelObject = options.tables
    .map(model => {
      try {
        const backofficeConfiguration = require(modelPath +
          model.name +
          ".js").getBackoffice();

        return {
          name: model.namePrint || model.name,
          conf: backofficeConfiguration
        };
      } catch (e) {
        console.error(`the file ${model.name} doesn't return a Model object`);
        return null;
      }
    })
    .filter(object => object); // return only non null object

  modelObject.forEach(model => {
    generateBackofficePage(model);
  });

  this.nuxt.hook("ready", async () => {
    console.log("- Backoffice generate");
  });
}
