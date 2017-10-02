/**
 * Class that represents a Sentry error.
 */
class SentryError extends Error {

    static LEVEL_ERROR() {
        return 'error';
    };

    static LEVEL_WARNING() {
        return 'warning';
    }

    static LEVEL_INFO() {
        return 'info';
    }

    /**
     * @param {string} message
     * @param {object} extra
     * @param {string} level
     * @param {boolean} is_report
     */
    constructor(message, extra = {}, level = SentryError.LEVEL_ERROR, is_report = true) {
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
        if ([SentryError.LEVEL_ERROR, SentryError.LEVEL_INFO, SentryError.LEVEL_WARNING].find(a => level === a)) {
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