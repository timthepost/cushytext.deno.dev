import type Site from "lume/core/site.ts";
import { log } from "lume/core/utils/log.ts";
import { merge } from "lume/core/utils/object.ts";
import { enMessages } from "./loc/en.js";
import { enCommonWords } from "./cw/en.js";

export type LengthUnit = "character" | "grapheme" | "word" | "sentence";
export type SeoReportMessages = typeof enMessages;

export interface Options {
    
    globalSettings: {
        ignore?: string[];
        stateFile?: string | null;
        debug?: boolean;
        defaultLengthUnit?: LengthUnit;
    };

    localeSettings: {
        defaultLocaleCode?: string;
        ignoreAllButLocaleCode?: string;
        commonWordSet?: Set<string>;
        reporterLocale?: SeoReportMessages;
    };

    commonWordPercentageChecks: {
        title?: number | false;
        description?: number | false;
        url?: number | false;
        minContentLengthForProcessing?: string;
        commonWordPercentageCallback?: ((title: string) => number) | null;
        rationaleLink: string;
    } | false;

    lengthChecks: {
        title?: string | false;
        url?: string | false;
        metaDescription?: string | false;
        content?: string | false;
        metaKeywordCount?: string | false;
        metaKeywordLength?: string | false;
        rationaleLink: string;
    } | false;

    semanticChecks: {
        headingOrder?: boolean;
        headingMultipleH1?: boolean;
        headingMissingH1?: boolean;
        rationaleLink: string;
    } | false;

    mediaAttributeChecks: {
        imageAlt?: string | false;
        imageTitle?: string | false;
        rationaleLink: string;
    } | false;

    googleSearchConsoleChecks: {
        apiEnvVariable?: string;
        checkIsIndexed?: boolean;
        checkWarnings?: boolean;
        checkErrors?: boolean;
        cacheDaysTTL?: number;
        rationaleLink: string;
    } | false;

    bingWebmasterToolsChecks: {
        apiEnvVariable?: string;
        indexNowEnvVariable?: string;
        apiKeyfileLocation?: string;
        checkPageStats?: boolean;
        checkURLStats?: boolean;
        checkTrafficData?: boolean;
        checkContentPerformance?: boolean;
        submitSiteMap?: boolean;
        rationaleLink: string;
    } | false;
}

export const defaultOptions: Options = {

    globalSettings: {
        ignore: ['/404.html'],
        stateFile: null,
        debug: false,
        defaultLengthUnit: "character",
    },

    localeSettings: {
        defaultLocaleCode: 'en',
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
        rationaleLink: "",
    },

    lengthChecks: {
        title: "max 80 character",
        url: "range 1 5 grapheme",
        metaDescription: "range 1 2 sentence",
        content: "range 3000 30000 word",
        metaKeywordCount: "range 4 6 number",
        metaKeywordLength: "max 10 word",
        rationaleLink: "",
    },

    semanticChecks: {
        headingOrder: true,
        headingMultipleH1: true,
        headingMissingH1: true,
        rationaleLink: "",
    },

    mediaAttributeChecks: {
        imageAlt: "range 10 1500 character",
        imageTitle: "min 0 character",
        rationaleLink: "",
    },

    googleSearchConsoleChecks: {
        apiEnvVariable: "GOOGLE_API_KEY",
        checkIsIndexed: true,
        checkWarnings: true,
        checkErrors: true,
        cacheDaysTTL: 7,
        rationaleLink: "",
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
        rationaleLink: "",
    }    
}

const lengthWarnings = new Map<string, Set<string>>();
const semanticWarnings = new Map<string, Set<string>>();
const commonWordWarnings = new Map<string, Set<string>>();
const mediaAttributeWarnings = new Map<string, Set<string>>();
const googleSearchConsoleWarnings = new Map<string, Set<string>>();
const bingWebmasterToolsWarnings = new Map<string, Set<string>>();

// see if a string conforms to the given config nomenclature.
function testLength(text: string, nomenclature: string): number {
    
    return 0;
}

// see if a string conforms to a common word percentage.
function testCwPercentage(text: string, percentage: number, nomenclature: string): number {
    
    return 0.00
}

export default function seo(userOptions?: Options) {
    
    const options = merge(defaultOptions, userOptions);
    const settings = options.globalSettings;
    const locale = options.localeSettings.reporterLocale!;

    return (site: Site) => {

        function logEvent(text: string): void {
            if (settings.debug) {
              log.debug(text);
            }
        }

        logEvent(locale.BEGIN_MESSAGE);

        site.process(['.html'], (pages) => {
            for (const page of pages) {
                const frontMatterConfig = page.data.seo || null;

                logEvent(locale.PROCESSING_MESSAGE + page.data.url);

                if (options.semanticChecks && ! frontMatterConfig.skip_semantic) {
                    semanticWarnings.clear();
                    // all semantic checks here
                }

                if (options.mediaAttributeChecks && ! frontMatterConfig.skip_media_attribute) {
                    mediaAttributeWarnings.clear();
                    // all media attribute checks here
                }

                if (options.commonWordPercentageChecks && ! frontMatterConfig.skip_common_word_percentage) {
                    commonWordWarnings.clear();
                    // all common word percentage checks here
                }

                if (options.lengthChecks && ! frontMatterConfig.skip_length) {
                    lengthWarnings.clear();
                    // all length  checks here
                }

                if (options.googleSearchConsoleChecks && ! frontMatterConfig.skip_google_search_console) {
                    googleSearchConsoleWarnings.clear();
                    // all google search console checks here
                }

                if (options.bingWebmasterToolsChecks && ! frontMatterConfig.skip_bing_webmaster_tools) {
                    bingWebmasterToolsWarnings.clear();
                    // all bing webmaster tools checks here
                }
            }
        });
        
        // generate debug bar report
        const debugBarReport = site.debugBar?.collection("SimpleSEO");
        if (debugBarReport) {
          debugBarReport.contexts = {
            "length-warning": {
              background: "warning",
            },
            "common-word-warning": {
              background: "warning",
            },
            "image-alt-warning": {
              background: "warning",
            },
            "image-title-warning": {
              background: "warning",
            },
            "semantic-structure-warning": {
              background: "error",
            },
            "google-search-console-warning": {
              background: "warning",
            },
            "missing-error": {
              background: "error",
            },
          };
          debugBarReport.icon = "list-magnifying-glass";
          debugBarReport.items = [];

          // iterate through report objects so warnings get grouped by type
        }

        // generate state file

        // send state info to callback if defined
        logEvent(locale.END_MESSAGE)
    }
}