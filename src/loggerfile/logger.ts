import { format, createLogger, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `${info.timestamp} [${info.level}] > ${info.message}`),
);

const levels = {
  error: 0,
  info: 1,
  debug: 2,
  warn: 3,
  data: 4,
  alert: 5,
};
 
const logger = createLogger({
  levels,
  format: logFormat,
  transports: [
    new DailyRotateFile({
      level:'info',
      filename: 'logs/rotate-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      maxSize: '30m',
    }),
    // new (transports.File)({
    //   filename: 'logs/debugfile.log',
    //   level: 'debug',
    // }) 
  ],
});

export default logger;
