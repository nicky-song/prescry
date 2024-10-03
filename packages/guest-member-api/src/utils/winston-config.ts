// Copyright 2018 Prescryptive Health, Inc.

import { createLogger, Logger, transports } from 'winston';

export class LoggerStream {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public write(message: string) {
    this.logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}

export const setLogger = (winstonLogFilePath: string): Logger => {
  const options = {
    console: {
      handleExceptions: false,
      json: true,
      level: 'info',
    },
    file: {
      colorize: false,
      filename: winstonLogFilePath,
      handleExceptions: false,
      json: true,
      level: 'info',
      maxFiles: 5,
      maxsize: 5242880,
    },
  };

  return createLogger({
    exitOnError: false,
    transports: [
      new transports.File(options.file),
      new transports.Console(options.console),
    ],
  });
};
