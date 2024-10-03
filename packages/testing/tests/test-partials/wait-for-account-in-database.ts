// Copyright 2023 Prescryptive Health, Inc.

import { Page } from '@playwright/test';
import { validateAccountInDatabase, Account } from '../../utilities';

/** Waits until the account is created in the database.
 * It should be removed when the Service Bus issue is solved.
 * Use the validateAccountInDatabase instead. */
export async function waitForAccountInDatabase(
  account: Account,
  page: Page,
  isComplete: boolean
) {
  const DELAY = 5000;
  for (let count = 0; count < 40; count++) {
    const result = await validateAccountInDatabase(account, isComplete);
    if (result) return;
    // eslint-disable-next-line no-console
    console.log(`Wait for account ${count}, isComplete ${isComplete}`);
    await page.waitForTimeout(DELAY);
  }
  throw new Error('Wait for account failed');
}
