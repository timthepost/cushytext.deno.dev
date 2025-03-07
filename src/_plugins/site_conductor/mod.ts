import { merge } from "lume/core/utils/object.ts";
import { log } from "lume/core/utils/log.ts";
import type Site from "lume/core/site.ts";


interface Options {
  extensions?: string[];
  ignore?: string[];
  tag_file?: string;
}

export const defaults: Options = {
  extensions: [".html"],
  ignore: ["/404.html"],
  tag_file: "/tags.json",
};

// things that go bump during the run
// for a report / callback 
const cachedWarnings = new Map<string, Set<string>>();

function cushyUpdate(msg: string): void {
  log.info(`☁️⠀⠀${msg}`);
}

// this may be removed.
export default function site_conductor(userOptions?: Options) {
  const options = merge(defaults, userOptions);
  cachedWarnings.clear();
  cushyUpdate("Starting up ...");

  return (site: Site) => {
    // code to generate tag counts 
    site.process(options.extensions, (pages) => {
      for (const _page of pages) {
        // do tag stuff
      }
    });
  };
}
