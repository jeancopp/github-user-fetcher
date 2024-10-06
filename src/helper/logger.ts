import winston from 'winston';
import dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.printf((info): string => {
      if (info.level === 'info') {
        return `${info.message}`;
      } else {
        return `${info.timestamp} [${info.level}][${info.file}] - ${info.message}`;
      }
    })
  ),
  transports: [
    new winston.transports.Console({ level: process.env.LOG_LEVEL || 'info' }),
    new winston.transports.File({
      filename: 'combined.log',
      level: 'debug'
    })
  ]
});

export default logger;