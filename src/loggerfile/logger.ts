import { format, createLogger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `${info.timestamp} [${info.level}] > ${info.message}`),
);

const logger = createLogger({
  format: logFormat,
  transports: [
    new DailyRotateFile({
      level: process.env.LOG_LEVEL || 'info',
      filename: 'logs/rotate-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      // Maximum size of the file after which it will rotate.This can be a number of bytes, or units of kb, mb, and gb.If using the units, add 'k', 'm', or 'g' as the suffix.
      maxFiles: '15d',
      // Maximum number of logs to keep. This can be a number of files or number of days. If using days, add 'd' as the suffix.
      maxSize: '30m',
    }), 
  ],
});

export default logger;
