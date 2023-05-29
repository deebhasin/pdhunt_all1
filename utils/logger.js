const winston = require("winston");
const { combine, timestamp, printf, colorize, align } = winston.format;

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const { dirname } = require("path");
const appDir = dirname(require.main.filename);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: `${appDir}/logs/combined.log`,
    }),
    new winston.transports.File({
      filename: `${appDir}/logs/error.log`,
      level: "error",
    }),
    new winston.transports.Console(),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: `${appDir}/logs/exception.log` })],
  rejectionHandlers: [new winston.transports.File({ filename: `${appDir}/logs/rejection.log` })],
});

logger.exitOnError = false;

logger.error("error");
logger.warn("warn");
logger.info("info");
// logger.verbose("verbose");
logger.debug("debug");
// logger.silly("silly");

logger.log("error", "error message");
logger.log("info", "info message");

module.exports = logger;
