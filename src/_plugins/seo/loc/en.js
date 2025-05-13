/**
 * Stores strings for logging purposes, with future internationalization in mind.
 * Access strings via friendly static property names.
 *
 * Translators: Please note that some strings end in spaces.
 */
export class enMessages {
  static APP_NAME = "SimpleSEO II";

  static BEGIN_MESSAGE = `${this.APP_NAME} is starting up...`;
  static END_MESSAGE = `${this.APP_NAME} has finished.`;
  static PROCESSING_MESSAGE = `${this.APP_NAME} is processing `;
  static ABOUT_WARNING_TYPE = "About This Warning Type";
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
}

export default enMessages;
