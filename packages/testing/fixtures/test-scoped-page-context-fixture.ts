// Copyright 2023 Prescryptive Health, Inc.

import { Page } from '@playwright/test';
import { test as base } from './base-fixtures.js';

export const test = base.extend<Record<string, unknown>, Page>({
  page: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await use(page);
      await context.close();
    },
    { scope: 'test' },
  ],
});
