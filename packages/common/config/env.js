// Copyright 2022 Prescryptive Health, Inc.

const { config } = require('dotenv');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

function getMode(parsed) {
  return parsed && parsed.NODE_ENV === DEVELOPMENT ? DEVELOPMENT : PRODUCTION;
}

function env() {
  const env = config();
  const mode = getMode(env.parsed);
  const environment = {
    ...env.parsed,
    mode,
    isDev: mode === DEVELOPMENT,
  };

  return environment;
}

module.exports = env;
