import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
            const {
                timestamp, level, message, ...args
            } = info;

            const ts = timestamp.slice(0, 19).replace('T', ' ');
            return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
        })
    ),
}));

logger.stream = {
    // @ts-ignore
    write: (message) => {
        logger.info(message.trim());
    },
};

export default logger;
