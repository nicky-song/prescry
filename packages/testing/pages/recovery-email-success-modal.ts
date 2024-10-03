// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class RecoveryEmailSuccessModal {
  private _page: Page;
  private _closeButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._closeButton = this._page.locator(
      '[data-testid="recoveryEmailSuccessModalCloseButton"]'
    );
  }

  pressCloseButton = async () => {
    await this._closeButton.click();
  };
}
