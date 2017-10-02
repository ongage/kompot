const raven = require('raven');
const packageJson = require('./package.json');
const fs = require('fs');
const mkdirp = require('mkdirp');
const SentryError = require('./SentryError');
const deepExtend = require('deep-extend');

raven.config(process.env.SENTRY_URL, {
    release: packageJson.version
});

const LEVEL_ERROR = 1;
const LEVEL_WARNING = 2;
const LEVEL_INFO = 3;
const LOGGER_LEVEL = process.env.LOGGER_LEVEL;
const LOGS_PATH = process.env.LOGS_PATH;
const LOGS_LIFE_SPAN = process.env.LOGS_LIFE_SPAN * 1000; // seconds converted to milliseconds

const getLogFilePath = level => {
    const prefix = ['none', 'error', 'warning', 'info'][level];
    let currentTime = Date.now();
    const timestamp = currentTime - currentTime % LOGS_LIFE_SPAN;
    return `${LOGS_PATH}/${prefix}-${new Date(timestamp).toISOString().slice(0, 19).replace(/\D/g, '-')}.log`;
};

fs.existsSync(LOGS_PATH) || mkdirp.sync(LOGS_PATH);

class Logger {
    static get LEVEL_ERROR() {
        return LEVEL_ERROR;
    }

    static get LEVEL_WARNING() {
        return LEVEL_WARNING;
    }

    static get LEVEL_INFO() {
        return LEVEL_INFO;
    }

    static log(message, isSentry = null, level = null, data = {}) {
        if (typeof message === 'object') {
            switch ( true )
            {
                case message instanceof SentryError:
                    isSentry = isSentry !== null ? isSentry : message.isReport();
                    level = level !== null ? level : ([
                        SentryError.LEVEL_ERROR(),
                        SentryError.LEVEL_WARNING(),
                        SentryError.LEVEL_INFO()
                    ].indexOf(message.getLevel()) + 1);
                    deepExtend(data, message.getExtraData());
                    message = message.getMessage();
                    break;

                case message instanceof Error:
                    message = message.message();
                    break;

                default:
                    message = message.toString();
            }
        } else {
            isSentry = isSentry || false;
            level = level || LEVEL_INFO;
        }
        if (level > LOGGER_LEVEL) {
            return;
        }
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
        let logMessage = `${timestamp} (${process.pid}): ${message}`;
        Object.keys(data).length && (logMessage += ` (${JSON.stringify(data)})`);
        const logFilename = getLogFilePath(level);
        fs.appendFile(logFilename, `${logMessage}\n`, {flag: 'a'}, err => {
            err && console.error(err);
        });
        let sentryLevel = 'info';
        switch (level) {
            case LEVEL_ERROR:
                sentryLevel = 'error';
                break;
            case LEVEL_WARNING:
                sentryLevel = 'warning';
                break;
            case LEVEL_INFO:
                sentryLevel = 'info';
                break;
        }
        isSentry && raven.captureException(message, {
            level: sentryLevel,
            extra: data
        });
    }
}

Logger.SentryError = SentryError;

module.exports = Logger;