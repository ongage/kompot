# Kompot 

Kompot is a nice beverage and a library that connects two running services via socket communication.

### Sender example: 
```js
const kompot = require('kompot');
const Sender = kompot.Sender;
const sender = new Sender(4242, 'localhost');
sender.send({hello: 'world'})
    .then(response => console.log(response))
    .catch(err => console.error(err.message));
```

### Receiver example: 
```js
const kompot = require('kompot');
const CommunicationError = kompot.CommunicationError;
const Receiver = kompot.Receiver;
const receiver = new Receiver(1234);
receiver.on('message', async (message) => {
    console.log(message);
    // use a regular return for confirmation
    if (await isMessageGood(message)) {
        return 'Message is good, thank you';
    }
    // throw an error with Duplicate reason, if the message was already processed before
    // in such case it will not be retried
    if (await isMessageAlreadyReceived(message)) {
        throw new CommunicationError('This message was already received', CommunicationError.REASON_DUPLICATE);
    }
    // throw a general error, if you cannot process it for some reason. It will be resent until confirmed
    throw new CommunicationError('This message is bad, sorry', CommunicationError.REASON_GENERAL);
});
```