import lume from "lume/mod.ts";
import plugins from "./plugins.ts";
import router from "./src/_server_routes.ts";
import cacheBusting from "lume/middlewares/cache_busting.ts";
import feed from "lume/plugins/feed.ts";

const site = lume({
  src: "./src",
  location: new URL("https://cushytext.deno.dev"),
  server: {
    middlewares: [router.middleware(), cacheBusting()],
  },
});

site.use(plugins());

site.use(feed(() => {
  const unknownTags = site.search.values("tags");
  const tags = unknownTags as string[];
  return tags.map((tag) => ({
    output: [`/feeds/tag/${tag}.xml`, `/feeds/tag/${tag}.json`],
    query: tag,
    info: {
      title: `Tag feed for ${tag}`
    }
  }));
}));

export default site;
