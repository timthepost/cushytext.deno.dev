import lume from "lume/mod.ts";
import plugins from "./plugins.ts";

const site = lume({
  src: "./src",
});

site.remoteFile(
  "_includes/css/infima-light.css",
  "https://cdn.jsdelivr.net/npm/infima@0.2.0-alpha.45/dist/css/default/default.css",
);
site.remoteFile(
  "_includes/css/infima-dark.css",
  "https://cdn.jsdelivr.net/npm/infima@0.2.0-alpha.45/dist/css/default-dark/default-dark.css",
);

site.use(plugins());

export default site;
