import { merge } from "lume/core/utils/object.ts";
import { log } from "lume/core/utils/log.ts";
import type Site from "lume/core/site.ts";

//TODO: Get the _site value from lume. User may change it.
const cushyPath = `${Deno.cwd()}/_site`;

interface Options {
  extensions?: string[];
  ignore?: string[];
  tag_file?: string;
}

export const defaults: Options = {
  extensions: [".html"],
  ignore: ["/404.html"],
  tag_file: `${cushyPath}/tags.json`,
};

// things that go bump during the run
const cachedWarnings = new Map<string, Set<string>>();

function cushyUpdate(msg:string) : void {
  log.info(`☁️⠀⠀${msg}`);
}

export default function CushyDocs(userOptions?: Options) {
  
  const options = merge(defaults, userOptions);
  cachedWarnings.clear();
  cushyUpdate('Starting up ...');

  return (site: Site) => {

    // code to generate tags
    site.process(options.extensions, (pages) => {
      for (const _page of pages) {
        // do tag stuff
      }
    }
  )};
}
