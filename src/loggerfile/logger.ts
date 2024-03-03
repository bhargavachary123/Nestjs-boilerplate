import { format, createLogger, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `${info.timestamp} [${info.level}] > ${info.message}`),
);

const logger = createLogger({
  format: logFormat,
  transports: [
    new DailyRotateFile({
      level:'info',
      filename: 'logs/rotate-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '15d', // past 15 days log files 
      maxSize: '30m', //each file max 30mb if exceed it will create one more file on same day
    }), 
  ],
});

export default logger;
