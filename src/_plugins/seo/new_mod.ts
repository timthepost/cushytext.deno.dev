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
    ignorePatterns?: string[];
    stateFile?: string | null;
    reportFile?: string | ((reportData: Map<string, string[]>) => void) | null;
    debug?: boolean;
    defaultLengthUnit?: LengthUnit;
    removeReportFileIfEmpty?: boolean;
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
    ignorePatterns: [],
    stateFile: null,
    reportFile: "./_seo_report.json",
    debug: true,
    defaultLengthUnit: "character",
    removeReportFileIfEmpty: true,
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

interface frontMatterConfig {
  ignore?: boolean;
  skipLength?: boolean;
  skipSemantic?: boolean;
  skipMedia?: boolean;
  skipCommonWords?: boolean;
  skipGoogleSearchConsole?: boolean;
  skipBingWebmasterTools?: boolean;
  overrideDefaultLocale?: string;
  overrideDebug?: boolean;
  overrideDefaultLengthUnit?: LengthUnit;
}

interface PageWarningDetails {
  messages: Set<string>;
  sourceFile: string; // Absolute path to the source file for editor links
}

interface SEOWarning {
  store: Map<string, PageWarningDetails>;
  check: string;
  rationale: (checkValue: string) => string;
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

  function rationaleLink(check: string): string {
    return `https://cushytext.deno.dev/docs/theme-plugins/#${check}`;
  }

  const warnings: SEOWarnings = {
    length: {
      store: new Map<string, PageWarningDetails>(),
      check: "length-warning",
      rationale: rationaleLink,
      title: locale.LENGTH_WARNING_TITLE,
    },

    semantic: {
      store: new Map<string, PageWarningDetails>(),
      check: "semantic-error",
      rationale: rationaleLink,
      title: locale.SEMANTIC_WARNING_TITLE,
    },

    commonWord: {
      store: new Map<string, PageWarningDetails>(),
      check: "common-word-warning",
      rationale: rationaleLink,
      title: locale.COMMON_WORD_WARNING_TITLE,
    },

    mediaAttribute: {
      store: new Map<string, PageWarningDetails>(),
      check: "media-attribute-warning",
      rationale: rationaleLink,
      title: locale.MEDIA_ATTRIBUTE_WARNING_TITLE,
    },

    googleSearchConsole: {
      store: new Map<string, PageWarningDetails>(),
      check: "google-search-console-warning",
      rationale: rationaleLink,
      title: locale.GOOGLE_CONSOLE_TITLE,
    },

    bingWebmasterTools: {
      store: new Map<string, PageWarningDetails>(),
      check: "bing-webmaster-tools-warning",
      rationale: rationaleLink,
      title: locale.BING_WEBMASTER_TITLE,
    },
  };

  function prepareReportData(
    warningsObject: SEOWarnings,
  ): Map<string, string[]> {
    const reportMap = new Map<string, string[]>();
    for (const categoryKey in warningsObject) {
      const category = warningsObject[categoryKey as keyof SEOWarnings];
      for (const [url, pageDetails] of category.store.entries()) {
        const existingMessages = reportMap.get(url) || [];
        reportMap.set(url, [...existingMessages, ...pageDetails.messages]);
      }
    }
    return reportMap;
  }

  return (site: Site) => {
    function logEvent(text: string): void {
      if (settings.debug) {
        log.info(text);
      }
    }

    logEvent(locale.BEGIN_MESSAGE);

    for (const key in warnings) {
      warnings[key as keyof SEOWarnings].store.clear();
    }

    site.process([".html"], (pages) => {
      for (const page of pages) {
        const pageUrl = page.data.url;
        const sourceFile = page.src.entry?.src;
        const frontMatter: frontMatterConfig | undefined = page.data.seo;

        // Page-level debug override
        const pageDebug = frontMatter?.overrideDebug ?? settings.debug;

        // We can't know this until we're inside, so we must. This is
        // necessary for per-page level debug.
        // deno-lint-ignore no-inner-declarations
        function pageLogEvent(text: string): void {
          if (pageDebug) {
            log.info(text);
          }
        }

        if (settings.ignore?.includes(pageUrl)) {
          pageLogEvent(locale.skippingPageConfigIgnore(pageUrl));
          continue;
        }

        let skipPageDueToPattern = false;
        if (settings.ignorePatterns && settings.ignorePatterns.length > 0) {
          for (const pattern of settings.ignorePatterns) {
            if (pageUrl.startsWith(pattern)) {
              pageLogEvent(locale.skippingPagePatternIgnore(pageUrl, pattern));
              skipPageDueToPattern = true;
              break; 
            }
          }
        }

        if (skipPageDueToPattern) {
          continue;
        }

        if (frontMatter?.ignore) {
          pageLogEvent(locale.skippingPageWarning(pageUrl));
          continue;
        }

        const pageEffectiveLocale = frontMatter?.overrideDefaultLocale ||
          page.data.lang ||
          options.localeSettings.defaultLocaleCode!;

        if (
          options.localeSettings.ignoreAllButLocaleCode &&
          pageEffectiveLocale !== options.localeSettings.ignoreAllButLocaleCode
        ) {
          pageLogEvent(
            locale.skippingPageLocaleMismatch(
              pageUrl,
              pageEffectiveLocale,
              options.localeSettings.ignoreAllButLocaleCode,
            ),
          );
          continue;
        }

        pageLogEvent(locale.PROCESSING_MESSAGE + page.data.url);

        if (options.semanticChecks) {
          if (frontMatter?.skipSemantic) {
            pageLogEvent(locale.skippingSemanticWarnings(pageUrl));
          } else {
            const warningStore = warnings.semantic.store;
            const pageSpecificWarnings: string[] = [];
            // all semantic checks here

            if (pageSpecificWarnings.length > 0) {
              let S = warningStore.get(pageUrl);
              if (!S) {
                S = {
                  messages: new Set<string>(),
                  sourceFile: sourceFile as string,
                };
                warningStore.set(pageUrl, S);
              }
              pageSpecificWarnings.forEach((msg) => S!.messages.add(msg));
            }
          }
        }

        if (options.mediaAttributeChecks) {
          if (frontMatter?.skipMedia) {
            pageLogEvent(locale.skippingMediaAttributeWarnings(pageUrl));
          } else {
            const warningStore = warnings.mediaAttribute.store;
            const pageSpecificWarnings: string[] = [];
            // all media attribute checks here


            if (pageSpecificWarnings.length > 0) {
              let S = warningStore.get(pageUrl);
              if (!S) {
                S = {
                  messages: new Set<string>(),
                  sourceFile: sourceFile as string,
                };
                warningStore.set(pageUrl, S);
              }
              pageSpecificWarnings.forEach((msg) => S!.messages.add(msg));
            }
          }
        }

        if (options.commonWordPercentageChecks) {
          if (frontMatter?.skipCommonWords) {
            pageLogEvent(locale.skippingUniquenessWarnings(pageUrl));
          } else {
            const warningStore = warnings.commonWord.store;
            const pageSpecificWarnings: string[] = [];
            // all content uniqueness checks here


            if (pageSpecificWarnings.length > 0) {
              let S = warningStore.get(pageUrl);
              if (!S) {
                S = {
                  messages: new Set<string>(),
                  sourceFile: sourceFile as string,
                };
                warningStore.set(pageUrl, S);
              }
              pageSpecificWarnings.forEach((msg) => S!.messages.add(msg));
            }
          }
        }

        if (options.lengthChecks) {
          if (frontMatter?.skipLength) {
            pageLogEvent(locale.skippingLengthWarnings(pageUrl));
          } else {
            const warningStore = warnings.length.store;
            const pageSpecificLengthWarnings: string[] = [];

            if (options.lengthChecks.title) {
              if (page.document.title) {
                const result = checkConformity(
                  page.document.title,
                  options.lengthChecks.title as string,
                  pageEffectiveLocale,
                  locale.CONTEXT_TITLE,
                );
                if (!result.conforms && result.message) {
                  pageLogEvent(result.message);
                  pageSpecificLengthWarnings.push(result.message);
                }
              } else {
                pageLogEvent(locale.ERROR_TITLE_MISSING);
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
                pageLogEvent(result.message);
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
                  pageLogEvent(result.message);
                  pageSpecificLengthWarnings.push(result.message);
                }
              } else {
                pageLogEvent(locale.ERROR_META_DESCRIPTION_MISSING);
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
                  pageLogEvent(result.message);
                  pageSpecificLengthWarnings.push(result.message);
                }
              }
            }

            if (options.lengthChecks.metaKeywordLength) {
              const metaKeywords = page.document.querySelectorAll(
                'meta[name="keywords"]',
              );
              if (metaKeywords && metaKeywords.length > 0) {
                let combinedKeywordsContent = "";
                for (const keyword of metaKeywords) {
                  if (keyword.getAttribute("content")) {
                    combinedKeywordsContent += keyword.getAttribute("content") +
                      " ";
                  }
                }
                combinedKeywordsContent = combinedKeywordsContent.trim();
                if (combinedKeywordsContent.length > 0) {
                  const result = checkConformity(
                    combinedKeywordsContent,
                    options.lengthChecks.metaKeywordLength as string,
                    pageEffectiveLocale,
                    locale.CONTEXT_META_KEYWORD_LEN,
                  );
                  if (!result.conforms && result.message) {
                    pageLogEvent(result.message);
                    pageSpecificLengthWarnings.push(result.message);
                  }
                }
              } else {
                pageLogEvent(locale.ERROR_META_KEYWORD_MISSING);
                pageSpecificLengthWarnings.push(
                  locale.ERROR_META_KEYWORD_MISSING,
                );
              }
            }

            if (pageSpecificLengthWarnings.length > 0) {
              let S = warningStore.get(pageUrl);
              if (!S) {
                S = {
                  messages: new Set<string>(),
                  sourceFile: sourceFile as string,
                };
                warningStore.set(pageUrl, S);
              }
              pageSpecificLengthWarnings.forEach((msg) => S!.messages.add(msg));
            }
          }
        }

        if (options.googleSearchConsoleChecks) {
          if (frontMatter?.skipGoogleSearchConsole) {
            pageLogEvent(locale.skippingGoogleConsoleWarnings(pageUrl));
          } else {
            const warningStore = warnings.googleSearchConsole.store;
            const pageSpecificWarnings: string[] = [];
            // all google search console checks here
  

            if (pageSpecificWarnings.length > 0) {
              let S = warningStore.get(pageUrl);
              if (!S) {
                S = {
                  messages: new Set<string>(),
                  sourceFile: sourceFile as string,
                };
                warningStore.set(pageUrl, S);
              }
              pageSpecificWarnings.forEach((msg) => S!.messages.add(msg));
            }
          }
        }

        if (options.bingWebmasterToolsChecks) {
          if (frontMatter?.skipBingWebmasterTools) {
            pageLogEvent(locale.skippingBingWebmasterWarnings(pageUrl));
          } else {
            const warningStore = warnings.bingWebmasterTools.store;
            const pageSpecificWarnings: string[] = [];
            // all bing webmaster tools checks here


            if (pageSpecificWarnings.length > 0) {
              let S = warningStore.get(pageUrl);
              if (!S) {
                S = {
                  messages: new Set<string>(),
                  sourceFile: sourceFile as string,
                };
                warningStore.set(pageUrl, S);
              }
              pageSpecificWarnings.forEach((msg) => S!.messages.add(msg));
            }
          }
        }
      }
    });

    site.addEventListener("afterBuild", () => {
      const debugBarReport = site.debugBar?.collection(locale.APP_NAME);
      if (debugBarReport) {
        logEvent(locale.populatingDebugBar(locale.APP_NAME));
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
            logEvent(locale.foundWarningsForCategory(warningStore.size, categoryKey))
          }

          const rationaleUrl = categoryInfo.rationale(categoryInfo.check);

          for (const [pageUrlString, pageWarningDetails] of warningStore) {
            const subItems = [];
            for (const message of pageWarningDetails.messages) {
              subItems.push({
                title: message,
                actions: [
                  {
                    text: locale.ACTIONS_ABOUT_WARNING_TYPE,
                    href: rationaleUrl,
                    icon: "question",
                  },
                  {
                    text: locale.ACTIONS_VISIT_PAGE,
                    href: pageUrlString,
                    icon: "globe",
                  },
                  {
                    text: locale.ACTIONS_OPEN_IN_VSCODE_EDITOR,
                    href: `vscode://file/${pageWarningDetails.sourceFile}`,
                    icon: "code",
                  },
                ],
              });
              totalWarningsAdded++;
            }
            if (subItems.length > 0) {
              debugBarReport.items.push({
                title: `${categoryInfo.title} for: ${pageUrlString}`,
                context: contextString,
                items: subItems,
              });
            }
          }
        }
        logEvent(locale.debugBarCompletionMessage(totalWarningsAdded));
        // We don't register on the build tab, as our own tab is evidence that we made it.
      } else {
        logEvent(locale.debugBarMissingMessage());
      }

      // Generate report file or call callback
      const finalReportData = prepareReportData(warnings);
      let totalWarningCount = 0;
      finalReportData.forEach((messages) => totalWarningCount += messages.length);

      if (typeof settings.reportFile === "function") {
        settings.reportFile(finalReportData);
        logEvent(
          `SEO: Report data passed to callback function. Found ${totalWarningCount} warnings.`,
        );
      } else if (typeof settings.reportFile === "string") {
        if (totalWarningCount > 0) {
          try {
            const reportJson = JSON.stringify(
              Object.fromEntries(finalReportData.entries()),
              null,
              2,
            );
            Deno.writeTextFileSync(settings.reportFile, reportJson);
            logEvent(locale.reportFileGenerated(settings.reportFile));
          } catch (e) {
            if (e instanceof Error) {
              log.error(locale.reportFileError(e.message));
            } else {
              log.error(locale.reportFileError(String(e)));
            }
          }
        } else {
          if (settings.removeReportFileIfEmpty) {
            try {
              Deno.removeSync(settings.reportFile);
              logEvent(locale.reportFileRemoved(settings.reportFile));
            } catch (_e) {
              // do nothing - it's often untracked and doesn't exist by default.
            }
          }
        }
      }
    });
  };
}
