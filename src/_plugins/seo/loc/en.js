/**
 * Stores strings for logging purposes, with future internationalization in mind.
 * Access strings via friendly static property names.
 *
 * Translators: Please note that some strings end in spaces.
 */
export class enMessages {
  static APP_NAME = "SimpleSEO II";

  static BEGIN_MESSAGE = `${this.APP_NAME} is starting up...`;
  static PROCESSING_MESSAGE = `${this.APP_NAME} is processing `;
  static ACTIONS_ABOUT_WARNING_TYPE = "About Warning";
  static ACTIONS_VISIT_PAGE = "Open In Browser";
  static ACTIONS_OPEN_IN_VSCODE_EDITOR = "Open In Code";
  static LENGTH_WARNING_TITLE = "Length Warnings";
  static MEDIA_ATTRIBUTE_WARNING_TITLE = "Media HTML Attribute Warnings";
  static COMMON_WORD_WARNING_TITLE = "Uniqueness Of Content Warnings";
  static SEMANTIC_WARNING_TITLE = "Document Semantic Structure Issues";
  static GOOGLE_CONSOLE_TITLE = "Google Search Console Data";
  static BING_WEBMASTER_TITLE = "Bing Webmaster Tools Data";
  static CONTEXT_TITLE = "Title";
  static CONTEXT_META_DESCRIPTION_LEN = "Meta Description Length";
  static CONTEXT_META_KEYWORD_COUNT = "Meta Keyword Count";
  static CONTEXT_META_KEYWORD_LEN = "Meta Keyword Length";
  static CONTEXT_MAIN_CONTENT_LEN = "Main Content Length";
  static CONTEXT_URL = "Page URL";
  static ERROR_META_DESCRIPTION_MISSING =
    "Meta Description Not Found In Document!";
  static ERROR_META_KEYWORD_MISSING = "Meta Keywords Not Found In Document!";
  static ERROR_TITLE_MISSING = "Title Not Found In Document!";
  static OPEN_IN_VSCODE_EDITOR = "Open In Code";

  static getDebugBarCompletionMessage(totalWarningsAdded) {
    return `[${this.APP_NAME}]: Run completed with ${totalWarningsAdded} warnings.`;
  }
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
}

export default enMessages;
