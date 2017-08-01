const net = require('net');
const Message = require('./Message');
const Acknowledge = require('./Acknowledge');

class Receiver {
    constructor(port) {
        this.server = net.createServer((socket) => {
            let buffer = '';
            socket.setEncoding('utf8');
            socket.on('data', (data) => {
                const handleData = async (rawData) => {
                    const {data, id} = JSON.parse(rawData);
                    const message = new Message(data, id);
                    const callback = this.listeners['message'] && this.listeners['message'];
                    let status;
                    let value;
                    try {
                        const result = await callback(message);
                        status = Acknowledge.STATUS_OK;
                        value = result;
                    }
                    catch (err) {
                        status = Acknowledge.STATUS_ERROR;
                        value = err;
                    }
                    socket.write(`${JSON.stringify(new Acknowledge(message.id, status, value))}\n`);
                };

                buffer += data;
                let delimiterPosition = buffer.indexOf('\n');
                while (delimiterPosition > -1) {
                    handleData(buffer.substring(0, delimiterPosition + 1))
                        .catch((err) => console.error(`Error in Receiver::handleData: ${err.message}`));
                    buffer = buffer.substring(delimiterPosition + 1);
                    delimiterPosition = buffer.indexOf('\n');
                }
            });
        });
        this.server.listen(port);
        this.listeners = {};
    }

    /**
     * Adds a listener to an event
     * @param event
     * @param callback
     */
    on(event, callback) {
        this.listeners[event] || (this.listeners[event] = []);
        event === 'message' ? this.listeners['message'] = callback : this.listeners[event].push(callback);
    }
}

module.exports = Receiver;