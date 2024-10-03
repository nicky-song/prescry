// Copyright 2018 Prescryptive Health, Inc.

import { createLogger, transports } from 'winston';
import { LoggerStream, setLogger } from './winston-config';

const loggerMock = {
  createLogger: jest.fn().mockImplementation(() => {
    return {
      info: jest.fn(),
    };
  }),
};

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

const mockWinstonLogFilePath = 'mockPath';

const log = loggerMock.createLogger();

describe('Winston Logger Configs', () => {
  it('expect LoggerStream to be defined', () => {
    expect(LoggerStream).toBeDefined();
  });

  it('LoggerStream should call logger.info with expected arguments', () => {
    const loggerStream = new LoggerStream(log);
    loggerStream.write('Test \n Log');
    expect(loggerStream.write).toBeDefined();
    expect(log.info).toHaveBeenCalledWith('Test ');
  });
});

describe('setupLogger()', () => {
  setLogger(mockWinstonLogFilePath);

  it('should call winston.transports.File with expected arguments', () => {
    expect(transports.File).toHaveBeenCalledWith({
      colorize: false,
      filename: 'mockPath',
      handleExceptions: false,
      json: true,
      level: 'info',
      maxFiles: 5,
      maxsize: 5242880,
    });
  });

  it('should call winston.transports.Console with expected arguments', () => {
    expect(transports.Console).toHaveBeenCalledWith({
      handleExceptions: false,
      json: true,
      level: 'info',
    });
  });

  it('should call winston.transports.Console with expected arguments', () => {
    expect(createLogger).toHaveBeenCalledWith({
      exitOnError: false,
      transports: [{}, {}],
    });
  });
});
