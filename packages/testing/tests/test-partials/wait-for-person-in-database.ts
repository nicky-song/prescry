// Copyright 2023 Prescryptive Health, Inc.

import { Page } from '@playwright/test';
import { Person } from '../../types';
import { validatePersonInDatabase } from '../../utilities';

/** Waits until the person is created in the database.
 * It should be removed when the Service Bus issue is solved.
 * Use the validatePersonInDatabase instead. */
export async function waitForPersonInDatabase(person: Person, page: Page) {
  const DELAY = 5000;
  for (let count = 0; count < 50; count++) {
    const result = await validatePersonInDatabase(person);
    if (result) return;
    page.waitForTimeout(DELAY);
  }
  throw new Error('Wait for person failed');
}
