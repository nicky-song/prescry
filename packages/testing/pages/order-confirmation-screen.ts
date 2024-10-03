// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class OrderConfirmationScreen {
  private _page: Page;
  private _bodyContentContainer: Locator;

  constructor(page: Page) {
    this._page = page;
    this._bodyContentContainer = this._page.locator(
      '[data-testid="orderConfirmationScreen"]'
    );
  }

  getContentOrderConfirmationScreen = () => {
    return this._bodyContentContainer;
  };
}
