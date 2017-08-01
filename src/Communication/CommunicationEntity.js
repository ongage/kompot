const microtime = require('microtime');

/**
 * This is a basic communication entity. Each communication entity must contain an ID and a timestamp.
 */
class CommunicationEntity {
    constructor(id) {
        this.timestamp = microtime.now();
        this.id = id;
    }
}

module.exports = CommunicationEntity;