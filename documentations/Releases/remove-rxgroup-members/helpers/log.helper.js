// Copyright 2022 Prescryptive Health, Inc.

import fs from 'fs';
import { formatDuration } from '../utils/time-formatter.js';

export const LoggerTypes = {
  Progress: 'Progress',
  Identification: 'Identification',
  Exception: 'Exception',
  Success: 'Success',
};

export const logVerbose = (message) => {
  const isVerboseMode = process.argv.includes('--verbose');
  if (isVerboseMode) {
    logProgress(message);
  }
};

export const logProgress = (message) => {
  console.log(message);
  message = typeof message !== 'string' ? JSON.stringify(message) : message;
  logToFile('', LoggerTypes.Progress, message);
};

export const logListToFile = (list, scope, type, getMessage) => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    logToFile(scope, type, getMessage(item, i));
  }
};

const createdLoggers = {};
export const logToFile = (scope, type, message) => {
  const key = scope + type;
  let logger = createdLoggers[key];
  if (!logger) {
    logger = createLogger(scope, type);
    createdLoggers[key] = logger;
  }
  fs.appendFileSync(logger, `${message}\n`);
};

const createLogger = (scope, type) => {
  const loggerPath = createLoggerPath(scope, type);
  forgePath(loggerPath);
  const newLogger = createLoggerFile(loggerPath, type);

  return newLogger;
};

export const closeLoggers = () => {
  for (const logger of Object.values(createdLoggers)) {
    fs.closeSync(logger);
  }
};

const logsFolder = process.env.LOGGER_PREFIX ?? 'logs';
export const runFolder = `run${
  new Date().toISOString().replaceAll(/:/g, '-').split('.')[0]
}`;
const createLoggerPath = (scope) => `${logsFolder}/${runFolder}/${scope}`;

const createLoggerFile = (path, loggerType) =>
  fs.openSync(`${path}\\${loggerType}.log`, 'a');

const forgePath = (path, currentPath) => {
  if (path === '') {
    return;
  }

  const pathParts = path.split(/[\\/]/);
  const nextPath = `${currentPath ?? ''}${pathParts.shift()}/`;
  if (!fs.existsSync(nextPath)) {
    fs.mkdirSync(nextPath);
  }
  forgePath(pathParts.join('/'), nextPath);
};

const isVerboseMode = process.argv.includes('--verbose');
const logLimit = 100;
const scopeCounts = {};
export const logLimited = (message, scope) => {
  const scopeCount = scopeCounts[scope] ?? 0;
  if (isVerboseMode || scopeCount <= logLimit) {
    logProgress(message);
  }
  if (!isVerboseMode && scopeCount === logLimit) {
    logProgress(
      'Console log limit reached for this scope, additional logs can be found in the log file'
    );
  }
  scopeCounts[scope] = scopeCount + 1;
};

export const logTime = () => {
  const duration = new Date().getTime() - global.startTime;
  logProgress(`Run time: ${formatDuration(duration)}`);
  logProgress(`Current Time: ${new Date().toLocaleString()}`);
};
