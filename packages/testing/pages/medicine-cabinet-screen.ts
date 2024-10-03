// Copyright 2023 Prescryptive Health, Inc.

import { Page } from '@playwright/test';

export class MedicineCabinetScreen {
  private readonly _page;

  constructor(page: Page) {
    this._page = page;
  }

  // TODO: remove this once it's not used anymore
  waitFor = () => this._page.waitForURL(/.*\/cabinet.*/);
}
