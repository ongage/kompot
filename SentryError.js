
// Constants
const LEVEL_ERROR   = 'error';
const LEVEL_WARNING = 'warning';
const LEVEL_INFO    = 'info';

/**
 * Class that represents a Sentry error.
 */
class SentryError extends Error {

    static LEVEL_ERROR() {
        return LEVEL_ERROR;
    }

    static LEVEL_WARNING() {
        return LEVEL_WARNING;
    }

    static LEVEL_INFO() {
        return LEVEL_INFO;
    }

    /**
     * @param {string} message
     * @param {object} extra
     * @param {string} level
     * @param {boolean} is_report
     */
    constructor(message, extra = {}, level = LEVEL_ERROR, is_report = true) {
        super(message);
        Error.captureStackTrace(this, SentryError);

        this.setLevel(level);
        this.setExtraData(extra);
        this.isReport(is_report);
    }

    /**
     * @returns {string}
     */
    getMessage() {
        return this.message;
    }

    /**
     * @param {boolean|null} set_value
     * @returns {boolean|undefined}
     */
    isReport(set_value = null) {
        if (set_value === null) {
            return this.is_send_to_sentry;
        }
        this.is_send_to_sentry = set_value;
    }

    /**
     * @returns {string}
     */
    getLevel() {
        return this.level;
    }

    /**
     *
     * @returns {object}
     */
    getExtraData() {
        return this.extra;
    }

    /**
     * @param {string} level
     */
    setLevel(level) {
        level = typeof level === 'function' ? level() : level;
        if ([LEVEL_ERROR, LEVEL_INFO, LEVEL_WARNING].includes(level)) {
            this.level = level+'';
        } else {
            throw new Error(`Reporting level can be only SentryError.LEVEL_ERROR, SentryError.LEVEL_INFO or SentryError.LEVEL_WARNING. Provided '${level}'.`);
        }
    }

    /**
     * @param {object} extra
     */
    setExtraData(extra) {
        this.extra = extra;
    }
}

module.exports = SentryError;