import cacheBusting from "lume/middlewares/cache_busting.ts";
import lume from "lume/mod.ts";
import plugins from "./plugins.ts";

import router from "./src/_server_routes.ts";

const site = lume({
  src: "./src",
  location: new URL("https://cushytext.deno.dev"),
  server: {
    middlewares: [
      router.middleware(), 
      cacheBusting()
    ],
  },
});

site.use(plugins());

export default site;
