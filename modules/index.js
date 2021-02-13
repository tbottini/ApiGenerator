
//on ajoute les composant
//on ajoute le sous service
//on recupere la config
//on active le module backoffice.js

import { join } from "path";

export default function () {
  console.debug("Module")
  const { nuxt, options } = this

  // Make sure components is enabled
  if (!nuxt.options.components) {
    throw new Error('please set `components: true` inside `nuxt.config` and ensure using `nuxt >= 2.13.0`')
  }

  this.nuxt.hook("components:dirs", (dirs) => {

    // Add ./components dir to the list
    dirs.push({
      path: join(__dirname, options.ecosystem.lib + "components")
    });
  });

  this.nuxt.moduleContainer.addServerMiddleware("./api/index.js")
}