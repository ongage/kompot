# Logger

Logger is a package that handles logging data to files and sending events to Sentry.

```js
const message = 'Shtoot';
const isSentry = false;
const level = Logger.LEVEL_WARNING;
const additionalData = {meh: 'booo'}; 
Logger.log(message, isSentry, level, additionalData);
```