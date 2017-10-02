require('dotenv').config();

const Logger = require('./app');
const SentryError = Logger.SentryError;

Logger.log('Simple Test No Report');
Logger.log('Sentry Test INFO', true);
Logger.log('Sentry Test WARNING', true, Logger.LEVEL_WARNING);
Logger.log('Sentry Test ERROR', true, Logger.LEVEL_ERROR);
Logger.log('Sentry Test Extra Data', true, Logger.LEVEL_INFO, {extra: 'data'});

Logger.log(new SentryError("Sentry Object Test Simple"));
Logger.log(new SentryError("Sentry Object Test Simple Warning", {}, SentryError.LEVEL_WARNING));
Logger.log(new SentryError("Sentry Object Test Simple Info", {}, SentryError.LEVEL_INFO));
Logger.log(new SentryError("Sentry Object Test Extra Data", {extra: 'data'}, SentryError.LEVEL_ERROR));
Logger.log(new SentryError("Sentry Object Test No Report", {}, SentryError.LEVEL_ERROR, false));