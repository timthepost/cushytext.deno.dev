/**
 * Stores strings for logging purposes, with future internationalization in mind.
 * Access strings via friendly static property names.
 *
 * Example:
 * import { LogMessages } from './logMessages.js'; // Adjust path as needed
 * console.log(LogMessages.STARTUP_MESSAGE);
 */
export class LogMessages {
    static APP_NAME = "SimpleSEO";

    static STARTUP_MESSAGE = `${this.APP_NAME} is starting up...`;
  }