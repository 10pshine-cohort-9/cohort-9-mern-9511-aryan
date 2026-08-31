const pinoHttp = require('pino-http');
const logger = require('../utils/logger');

const httpLogger = /** @type {any} */ (pinoHttp)({
  logger,
  customLogLevel: (/** @type {any} */ req, /** @type {any} */ res, /** @type {any} */ err) => {
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
  customSuccessMessage: (/** @type {any} */ req, /** @type {any} */ res) => {
    return `${req.method} ${req.url} completed with status ${res.statusCode}`;
  },
  customErrorMessage: (/** @type {any} */ req, /** @type {any} */ res, /** @type {any} */ err) => {
    return `${req.method} ${req.url} failed with error: ${err.message}`;
  },
  serializers: {
    req: (/** @type {any} */ req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent']
      }
    }),
    res: (/** @type {any} */ res) => ({
      statusCode: res.statusCode
    })
  }
});

module.exports = httpLogger;
