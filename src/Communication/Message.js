const uuidv4 = require('uuid/v4');
const CommunicationEntity = require('./CommunicationEntity');

/**
 * This is a message sent by Sender class. It holds data object and a unique ID.
 */
class Message extends CommunicationEntity {
    constructor(data, id) {
        super(id || uuidv4());
        this.data = data;
    }
}

module.exports = Message;