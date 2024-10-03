// Copyright 2022 Prescryptive Health, Inc.

import { FullConfig } from '@playwright/test';

function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  if (baseURL === undefined) {
    throw new Error(`BaseURL:${baseURL} is not defined`);
  }
}

export default globalSetup;
