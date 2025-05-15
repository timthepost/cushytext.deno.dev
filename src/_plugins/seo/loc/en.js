/**
 * Stores strings for logging purposes, with future internationalization in mind.
 * Access strings via friendly static property names.
 *
 * To translate:
 * 
 *  1. Copy this file to the target language, e.g. es.js, ja.js, 
 *  2. Translate the *strings* only, not the member names. 
 *  3. Import your translation in your lume _config.ts or plugins.ts file
 *  3. Pass it to the plugin via config option LocaleSettings.reporterLocale
 */
export class enMessages {
  // miscellaneous strings
  static APP_NAME = "SimpleSEO II";
  static BEGIN_MESSAGE = `${this.APP_NAME} is starting up...`;
  static PROCESSING_MESSAGE = `${this.APP_NAME} is processing `;

  // warning types
  static LENGTH_WARNING_TITLE = "Length Warnings";
  static MEDIA_ATTRIBUTE_WARNING_TITLE = "Media HTML Attribute Warnings";
  static COMMON_WORD_WARNING_TITLE = "Uniqueness Of Content Warnings";
  static SEMANTIC_WARNING_TITLE = "Document Semantic Structure Issues";
  static GOOGLE_CONSOLE_TITLE = "Google Search Console Data";
  static BING_WEBMASTER_TITLE = "Bing Webmaster Tools Data";

  // warning  contexts
  static CONTEXT_TITLE = "Title";
  static CONTEXT_META_DESCRIPTION_LEN = "Meta Description Length";
  static CONTEXT_META_KEYWORD_COUNT = "Meta Keyword Count";
  static CONTEXT_META_KEYWORD_LEN = "Meta Keyword Length";
  static CONTEXT_MAIN_CONTENT_LEN = "Main Content Length";
  static CONTEXT_URL = "Page URL";

  // error messages
  static ERROR_META_DESCRIPTION_MISSING =
    "Meta Description Not Found In Document!";
  static ERROR_META_KEYWORD_MISSING = "Meta Keywords Not Found In Document!";
  static ERROR_TITLE_MISSING = "Title Not Found In Document!";

  // Lume bar action buttons
  static ACTIONS_ABOUT_WARNING_TYPE = "About Warning";
  static ACTIONS_VISIT_PAGE = "Open In Browser";
  static ACTIONS_OPEN_IN_VSCODE_EDITOR = "Open In Code";

  // all the skips
  static skippingLengthWarnings(url) {
    return `${this.APP_NAME}: Skipping length warnings for ${url} as per frontmatter.`;
  }
  static skippingPageWarning(url) {
    return `${this.APP_NAME}: Skipping page: ${url} entirely as per frontmatter.`;
  }
  static skippingSemanticWarnings(url) {
    return `${this.APP_NAME}: Skipping semantic warnings for ${url} as per frontmatter.`;
  }
  static skippingMediaAttributeWarnings(url) {
    return `${this.APP_NAME}: Skipping media attribute warnings for ${url} as per frontmatter.`;
  }
  static skippingUniquenessWarnings(url) {
    return `${this.APP_NAME}: Skipping uniqueness warnings for ${url} as per frontmatter.`;
  }
  static skippingGoogleConsoleWarnings(url) {
    return `${this.APP_NAME}: Skipping Google Console warnings for ${url} as per frontmatter.`;
  }
  static skippingBingWebmasterWarnings(url) {
    return `${this.APP_NAME}: Skipping Bing Webmaster Tools warnings for ${url} as per frontmatter.`;
  }
  static skippingPageLocaleMismatch(url, locale, expectedLocale) {
    return `${this.APP_NAME}: Skipping ${url} (locale: ${locale}) due to 'ignoreAllButLocaleCode: ${expectedLocale}.`;
  }
  static skippingPageConfigIgnore(url) {
    return `${this.APP_NAME}: Skipping ${url} as per GlobalSettings config.`;
  }
  static skippingPagePerLocaleIgnore(url, locale) {
    return `${this.APP_NAME}: Skipping ${url} (locale: ${locale}) as per LocaleSettings config.`;
  }
  static skippingPagePatternIgnore(url, pattern) {
    return `${this.APP_NAME}: Skipping ${url} as it matches ignore pattern '${pattern}'.`;
  }

  // Lume bar messages
  static populatingDebugBar(category) {
    return `${this.APP_NAME}: Populating debug bar for ${category}.`;
  }
  static debugBarCompletionMessage(totalWarningsAdded) {
    return `${this.APP_NAME}: Run completed with ${totalWarningsAdded} warnings.`;
  }
  static debugBarMissingMessage() {
    return `${this.APP_NAME}: Debug bar object is missing; is this Lume 3?`;
  }

  // miscellaneous 
  static foundWarningsForCategory(count, category) {
    return `${this.APP_NAME}: Found ${count} warnings for ${category}.`;
  }
}

export default enMessages;
