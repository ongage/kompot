const net = require('net');
const microtime = require('microtime');
const Message = require('./Message');
const Acknowledge = require('./Acknowledge');
const CommunicationError = require('./../Error/CommunicationError');

class Sender {
    constructor(port, host) {
        const connect = () => {
            this.connected || this.socket.connecting || this.socket.connect(port, host);
        };

        this.socket = new net.Socket();
        this.socket.setEncoding('utf8');
        this.socket.on('connect', () => this.connected = true);
        this.socket.on('error', () => {
            this.connected = false;
            setTimeout(connect, 0);
        });
        this.socket.on('end', () => {
            this.connected = false;
            setTimeout(connect, 0);
        });
        let buffer = '';
        this.socket.on('data', (rawData) => {
            const handleData = async (data) => {
                const {id, status, value} = JSON.parse(data);
                const acknowledge = new Acknowledge(id, status, value);
                this.sent[acknowledge.id] && this.sent[acknowledge.id].callback(acknowledge);
            };

            buffer += rawData;
            let delimiterPosition = buffer.indexOf('\n');
            while (delimiterPosition > -1) {
                handleData(buffer.substring(0, delimiterPosition + 1))
                    .catch((err) => console.error(`Error in Sender::handleData: ${err}`));
                buffer = buffer.substring(delimiterPosition + 1);
                delimiterPosition = buffer.indexOf('\n');
            }
        });
        this.connected = false;
        this.sent = {};
        connect(port, host);
    }

    /**
     * Sends a message and waits for the result. Returns a Promise that is fulfilled when the message is delivered,
     * or rejected it the received did not accept the message. If no response received after a timeout, the Promise
     * is also rejected.
     * @param data
     * @param timeout
     * @returns {Promise}
     */
    async send(data, timeout = 1000) {
        return new Promise((fulfill, reject) => {
            if (!this.connected) {
                throw new CommunicationError('Not connected', CommunicationError.REASON_GENERAL);
            }
            const message = new Message(data);
            this.sent[message.id] = {
                timestamp: microtime.now(),
                callback: (acknowledge) => {
                    acknowledge.status === Acknowledge.STATUS_OK && fulfill(acknowledge.value);
                    acknowledge.status === Acknowledge.STATUS_ERROR && reject(
                        new CommunicationError(acknowledge.value.message, acknowledge.value.reason)
                    );
                }
            };
            this.socket.write(`${JSON.stringify(message)}\n`);
            setTimeout(() => {
                reject(new CommunicationError(`Message ${message.id} timeout`, CommunicationError.REASON_GENERAL))
            }, timeout);
        });
    }
}

module.exports = Sender;