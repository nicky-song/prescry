// Copyright 2022 Prescryptive Health, Inc.

const config = {
  plugins: [
    'filename-rules'
  ],
  rules: {
    'filename-rules/match': [
      'error',
      /^[a-z]+([a-z0-9])*((-|\.)[a-z0-9]+)*$/
    ]
  }
}

// eslint-disable-next-line no-undef
module.exports = config;
