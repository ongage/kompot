const CommunicationEntity = require('./CommunicationEntity');

/**
 * This is an acknowledge sent by Receiver class to notify the Sender about the results: success or failure.
 */
class Acknowledge extends CommunicationEntity {
    static get STATUS_OK() {
        return 'ok';
    }

    static get STATUS_ERROR() {
        return 'error';
    }

    constructor(id, status, value) {
        super(id);
        this.status = status;
        this.value = value;
    }
}

module.exports = Acknowledge;