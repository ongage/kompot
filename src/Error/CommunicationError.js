const REASON_DUPLICATE = 'duplicate';
const REASON_GENERAL = 'general';

class CommunicationError extends Error {
    static get REASON_DUPLICATE() {
        return REASON_DUPLICATE;
    }

    static get REASON_GENERAL() {
        return REASON_GENERAL;
    }

    constructor(message, reason) {
        super(message);
        this.reason = reason;
    }

    toJSON() {
        return {message: this.message, reason: this.reason};
    }
}

module.exports = CommunicationError;