// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class AccountLockedScreen {
  private _page: Page;
  private _accountLockedMessage: Locator;

  constructor(page: Page) {
    this._page = page;
    this._accountLockedMessage = this._page.getByTestId(
      'accountLockedBodyContentContainer'
    );
  }

  accountLockedMessage = () => this._accountLockedMessage;
}
