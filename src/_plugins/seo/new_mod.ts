import type Site from "lume/core/site.ts";
import { log } from "lume/core/utils/log.ts";
import { merge } from "lume/core/utils/object.ts";
import { enMessages } from "./loc/en.js";
import { enCommonWords } from "./cw/en.js";
import {
  type LengthUnit,
  type RequirementResult,
  SimpleConforms,
} from "./utils/simple_conforms.ts";

export type SeoReportMessages = typeof enMessages;

export interface Options {
  globalSettings?: {
    ignore?: string[];
    stateFile?: string | null;
    debug?: boolean;
    defaultLengthUnit?: LengthUnit;
  };

  localeSettings?: {
    defaultLocaleCode?: string;
    ignoreAllButLocaleCode?: string;
    commonWordSet?: Set<string>;
    reporterLocale?: SeoReportMessages;
  };

  commonWordPercentageChecks?: {
    title?: number | false;
    description?: number | false;
    url?: number | false;
    minContentLengthForProcessing?: string;
    commonWordPercentageCallback?: ((title: string) => number) | null;
  } | false;

  lengthChecks?: {
    title?: string | false;
    url?: string | false;
    metaDescription?: string | false;
    content?: string | false;
    metaKeywordCount?: string | false;
    metaKeywordLength?: string | false;
  } | false;

  semanticChecks?: {
    headingOrder?: boolean;
    headingMultipleH1?: boolean;
    headingMissingH1?: boolean;
  } | false;

  mediaAttributeChecks?: {
    imageAlt?: string | false;
    imageTitle?: string | false;
  } | false;

  googleSearchConsoleChecks?: {
    apiEnvVariable?: string;
    checkIsIndexed?: boolean;
    checkWarnings?: boolean;
    checkErrors?: boolean;
    cacheDaysTTL?: number;
  } | false;

  bingWebmasterToolsChecks?: {
    apiEnvVariable?: string;
    indexNowEnvVariable?: string;
    apiKeyfileLocation?: string;
    checkPageStats?: boolean;
    checkURLStats?: boolean;
    checkTrafficData?: boolean;
    checkContentPerformance?: boolean;
    submitSiteMap?: boolean;
  } | false;
}

export const defaultOptions: Options = {
  globalSettings: {
    ignore: ["/404.html"],
    stateFile: null,
    debug: true,
    defaultLengthUnit: "character",
  },

  localeSettings: {
    defaultLocaleCode: "en",
    ignoreAllButLocaleCode: undefined,
    commonWordSet: enCommonWords,
    reporterLocale: enMessages,
  },

  commonWordPercentageChecks: {
    title: 45,
    description: 55,
    url: 20,
    minContentLengthForProcessing: "1500 character",
    commonWordPercentageCallback: null,
  },

  lengthChecks: {
    title: "max 80 character",
    url: "max 60 character",
    metaDescription: "range 1 2 sentence",
    content: "range 1500 30000 word",
    metaKeywordCount: "range 2 6 number",
    metaKeywordLength: "max 10 word",
  },

  semanticChecks: {
    headingOrder: true,
    headingMultipleH1: true,
    headingMissingH1: true,
  },

  mediaAttributeChecks: {
    imageAlt: "range 10 1500 character",
    imageTitle: false,
  },

  googleSearchConsoleChecks: {
    apiEnvVariable: "GOOGLE_API_KEY",
    checkIsIndexed: true,
    checkWarnings: true,
    checkErrors: true,
    cacheDaysTTL: 7,
  },

  bingWebmasterToolsChecks: {
    apiEnvVariable: "BING_API_KEY",
    indexNowEnvVariable: "BING_API_INDEX_NOW_KEY",
    apiKeyfileLocation: "",
    checkPageStats: true,
    checkURLStats: true,
    checkTrafficData: true,
    checkContentPerformance: true,
    submitSiteMap: true,
  },
};

interface SEOWarning {
  store: Map<string, Set<string>>;
  check: string;
  rationale: string;
  title: string;
}

interface SEOWarnings {
  length: SEOWarning;
  semantic: SEOWarning;
  commonWord: SEOWarning;
  mediaAttribute: SEOWarning;
  googleSearchConsole: SEOWarning;
  bingWebmasterTools: SEOWarning;
}

export default function simpleSEO(userOptions?: Options) {
  const options = merge(defaultOptions, userOptions);
  const settings = options.globalSettings;
  const locale = options.localeSettings.reporterLocale!;

  function checkConformity(
    inputValue: string | number | null | undefined,
    nomenclature: string,
    pageLocale: string,
    context: string,
  ): RequirementResult {
    const checker = new SimpleConforms(nomenclature, pageLocale);
    return checker.test(inputValue, context);
  }

  const warnings: SEOWarnings = {
    length: {
      store: new Map<string, Set<string>>(),
      check: "length-warning",
      rationale: "",
      title: locale.LENGTH_WARNING_TITLE,
    },

    semantic: {
      store: new Map<string, Set<string>>(),
      check: "semantic",
      rationale: "",
      title: locale.SEMANTIC_WARNING_TITLE,
    },

    commonWord: {
      store: new Map<string, Set<string>>(),
      check: "common-word-warning",
      rationale: "",
      title: locale.COMMON_WORD_WARNING_TITLE,
    },

    mediaAttribute: {
      store: new Map<string, Set<string>>(),
      check: "media-attribute-warning",
      rationale: "",
      title: locale.MEDIA_ATTRIBUTE_WARNING_TITLE,
    },

    googleSearchConsole: {
      store: new Map<string, Set<string>>(),
      check: "google-search-console-warning",
      rationale: "",
      title: locale.GOOGLE_CONSOLE_TITLE,
    },

    bingWebmasterTools: {
      store: new Map<string, Set<string>>(),
      check: "bing-webmaster-tools-warning",
      rationale: "",
      title: locale.BING_WEBMASTER_TITLE,
    },
  };

  return (site: Site) => {
    function logEvent(text: string): void {
      if (settings.debug) {
        log.info(text);
      }
    }

    logEvent(locale.BEGIN_MESSAGE);

    // Clear all warning stores once before processing pages
    for (const key in warnings) {
      warnings[key as keyof SEOWarnings].store.clear();
    }

    site.process([".html"], (pages) => {
      for (const page of pages) {
        const pageEffectiveLocale = page.data.lang ||
          options.localeSettings.defaultLocaleCode!;

        logEvent(locale.PROCESSING_MESSAGE + page.data.url);

        if (options.semanticChecks) {
          const warningStore = warnings.semantic.store;
          const pageSpecificWarnings: string[] = [];
          // all semantic checks here

          if (pageSpecificWarnings.length > 0) {
            let S = warningStore.get(page.data.url);
            if (!S) {
              S = new Set<string>();
              warningStore.set(page.data.url, S);
            }
            pageSpecificWarnings.forEach((msg) => S!.add(msg));
          }
        }

        if (options.mediaAttributeChecks) {
          const warningStore = warnings.mediaAttribute.store;
          const pageSpecificWarnings: string[] = [];
          // all media attribute checks here

          if (pageSpecificWarnings.length > 0) {
            let S = warningStore.get(page.data.url);
            if (!S) {
              S = new Set<string>();
              warningStore.set(page.data.url, S);
            }
            pageSpecificWarnings.forEach((msg) => S!.add(msg));
          }
        }

        if (options.commonWordPercentageChecks) {
          const warningStore = warnings.commonWord.store;
          const pageSpecificWarnings: string[] = [];
          // all common word percentage checks here

          if (pageSpecificWarnings.length > 0) {
            let S = warningStore.get(page.data.url);
            if (!S) {
              S = new Set<string>();
              warningStore.set(page.data.url, S);
            }
            pageSpecificWarnings.forEach((msg) => S!.add(msg));
          }
        }

        if (options.lengthChecks) {
          const warningStore = warnings.length.store;
          const pageSpecificLengthWarnings: string[] = [];

          if (options.lengthChecks.title && page.document.title) {
            const result = checkConformity(
              page.document.title,
              options.lengthChecks.title as string,
              pageEffectiveLocale,
              locale.CONTEXT_TITLE,
            );
            if (!result.conforms && result.message) {
              logEvent(result.message);
              pageSpecificLengthWarnings.push(result.message);
            } else {
              logEvent(locale.ERROR_TITLE_MISSING);
              pageSpecificLengthWarnings.push(locale.ERROR_TITLE_MISSING);
            }
          }

          if (options.lengthChecks.url) {
            const result = checkConformity(
              page.data.url,
              options.lengthChecks.url as string,
              pageEffectiveLocale,
              locale.CONTEXT_URL,
            );
            if (!result.conforms && result.message) {
              logEvent(result.message);
              pageSpecificLengthWarnings.push(result.message);
            }
          }

          if (options.lengthChecks.metaDescription) {
            const metaDescriptionElement = page.document.querySelector(
              'meta[name="description"]',
            );
            const metaDescription = metaDescriptionElement?.getAttribute(
              "content",
            );
            if (metaDescription !== null && metaDescription !== undefined) {
              const result = checkConformity(
                metaDescription,
                options.lengthChecks.metaDescription as string,
                pageEffectiveLocale,
                locale.CONTEXT_META_DESCRIPTION_LEN,
              );
              if (!result.conforms && result.message) {
                logEvent(result.message);
                pageSpecificLengthWarnings.push(result.message);
              }
            } else {
              logEvent(locale.ERROR_META_DESCRIPTION_MISSING);
              pageSpecificLengthWarnings.push(
                locale.ERROR_META_DESCRIPTION_MISSING,
              );
            }
          }

          if (options.lengthChecks.content) {
            if (page.document.body) {
              const result = checkConformity(
                page.document.body.innerText,
                options.lengthChecks.content as string,
                pageEffectiveLocale,
                locale.CONTEXT_MAIN_CONTENT_LEN,
              );
              if (!result.conforms && result.message) {
                logEvent(result.message);
                pageSpecificLengthWarnings.push(result.message);
              }
            }
          }

          if (options.lengthChecks.metaKeywordCount) {
            const metaKeywords = page.document.querySelectorAll(
              'meta[name="keywords"]',
            );
            if (metaKeywords) {
              const result = checkConformity(
                metaKeywords.length,
                options.lengthChecks.metaKeywordCount as string,
                pageEffectiveLocale,
                locale.CONTEXT_META_KEYWORD_COUNT,
              );
              if (!result.conforms && result.message) {
                logEvent(result.message);
                pageSpecificLengthWarnings.push(result.message);
              }
            } else {
              logEvent(locale.ERROR_META_KEYWORD_MISSING);
              pageSpecificLengthWarnings.push(
                locale.ERROR_META_KEYWORD_MISSING,
              );
            }
          }

          if (options.lengthChecks.metaKeywordLength) {
            const metaKeywords = page.document.querySelectorAll(
              'meta[name="keywords"]',
            );
            if (metaKeywords) {
              let keywordLength = 0;
              for (const keyword of metaKeywords) {
                if (keyword.getAttribute("content")) {
                  keywordLength += keyword.getAttribute("content")!.length;
                }
              }
              if (keywordLength > 0 || metaKeywords.length > 0) {
                const result = checkConformity(
                  keywordLength,
                  options.lengthChecks.metaKeywordLength as string,
                  pageEffectiveLocale,
                  locale.CONTEXT_META_KEYWORD_LEN,
                );
                if (!result.conforms && result.message) {
                  logEvent(result.message);
                  pageSpecificLengthWarnings.push(result.message);
                }
              }
            }
          }

          if (pageSpecificLengthWarnings.length > 0) {
            let S = warningStore.get(page.data.url);
            if (!S) {
              S = new Set<string>();
              warningStore.set(page.data.url, S);
            }
            pageSpecificLengthWarnings.forEach((msg) => S!.add(msg));
          }
        }

        if (options.googleSearchConsoleChecks) {
          const warningStore = warnings.googleSearchConsole.store;
          const pageSpecificWarnings: string[] = [];
          // all google search console checks here

          if (pageSpecificWarnings.length > 0) {
            let S = warningStore.get(page.data.url);
            if (!S) {
              S = new Set<string>();
              warningStore.set(page.data.url, S);
            }
            pageSpecificWarnings.forEach((msg) => S!.add(msg));
          }
        }

        if (options.bingWebmasterToolsChecks) {
          const warningStore = warnings.bingWebmasterTools.store;
          const pageSpecificWarnings: string[] = [];
          // all bing webmaster tools checks here

          if (pageSpecificWarnings.length > 0) {
            let S = warningStore.get(page.data.url);
            if (!S) {
              S = new Set<string>();
              warningStore.set(page.data.url, S);
            }
            pageSpecificWarnings.forEach((msg) => S!.add(msg));
          }
        }
      }
    });

    // Hook to generate the debug bar report after the site build is complete
    site.addEventListener("afterBuild", () => {
      const debugBarReport = site.debugBar?.collection(locale.APP_NAME);
      if (debugBarReport) {
        logEvent(`SEO: Populating debug bar for ${locale.APP_NAME}.`);
        debugBarReport.contexts = {};
        for (const key in warnings) {
          const categoryInfo = warnings[key as keyof SEOWarnings];
          // just determine background color dynamically
          const background = categoryInfo.check.includes("semantic")
            ? "error"
            : "warning";
          debugBarReport.contexts[categoryInfo.check] = { background };
        }

        if (!debugBarReport.contexts["missing-error"]) {
          debugBarReport.contexts["missing-error"] = { background: "error" };
        }

        debugBarReport.icon = "list-magnifying-glass";
        debugBarReport.items = [];

        let totalWarningsAdded = 0;
        for (const categoryKey in warnings) {
          const categoryInfo = warnings[categoryKey as keyof SEOWarnings];
          const contextString = categoryInfo.check;
          const warningStore = categoryInfo.store;

          if (warningStore.size > 0) {
            logEvent(
              `SEO: Found ${warningStore.size} pages with warnings for category '${categoryKey}'.`,
            );
          }

          // If no user links are supplied, link to the main docs for why checks run
          const rationaleLink = categoryInfo.rationale ||
            `https://cushytext.deno.dev/docs/theme-plugins/#${contextString}`;

          for (const [pageUrl, messageSet] of warningStore) {
            const subItems = [];
            for (const message of messageSet) {
              subItems.push({
                title: message,
                actions: [
                  {
                    text: locale.ACTIONS_ABOUT_WARNING_TYPE,
                    href: rationaleLink,
                  },
                  {
                    text: locale.ACTIONS_VISIT_PAGE,
                    href: pageUrl,
                  },
                ],
              });
              totalWarningsAdded++;
            }
            if (subItems.length > 0) {
              debugBarReport.items.push({
                title: `${categoryInfo.title} for: ${pageUrl}`,
                context: contextString,
                items: subItems,
              });
            }
          }
        }
        logEvent(
          `SEO: Added ${totalWarningsAdded} items to the debug bar for ${locale.APP_NAME}.`,
        );
      } else {
        logEvent(
          `SEO: Debug bar collection for ${locale.APP_NAME} not found. Is this Lume 3?`,
        );
      }
    });

    // generate state file

    // send state info to callback if defined
  };
}
