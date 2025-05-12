/**
 * Stores strings for logging purposes, with future internationalization in mind.
 * Access strings via friendly static property names.
 *
 * Translators: Please note that some strings end in spaces.
 */
export class enMessages {
    static APP_NAME = "SimpleSEO";

    static BEGIN_MESSAGE = `${this.APP_NAME} is starting up...`;
    static END_MESSAGE = `${this.APP_NAME} has finished.`;
    static PROCESSING_MESSAGE = `${this.APP_NAME} is processing `;
}

export default enMessages;
