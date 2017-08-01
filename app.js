const Sender = require('./src/Communication/Sender');
const Receiver = require('./src/Communication/Receiver');
const CommunicationError = require('./src/Error/CommunicationError');

exports.Sender = Sender;
exports.Receiver = Receiver;
exports.CommunicationError = CommunicationError;