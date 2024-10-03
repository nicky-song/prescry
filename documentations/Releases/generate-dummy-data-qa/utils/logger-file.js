// Copyright 2022 Prescryptive Health, Inc.

import fs from 'fs';

export const createLoggerFile = async (fileName) => {
  return fs.openSync(`${fileName}_${new Date().getTime()}.log`, 'a');
};

export const closeLoggerFile = async (fileName) => {
  fs.closeSync(fileName);
};

export const writeToLogAndConsole = async (logger, message) => {
  fs.appendFileSync(logger, `${message}\n`);
  console.log(message);
};
