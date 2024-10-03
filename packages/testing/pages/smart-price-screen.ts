// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class SmartPriceScreen {
  private _page: Page;
  private _manageMyInfoIcon: Locator;
  private _cardSection: Locator;

  constructor(page: Page) {
    this._page = page;
    this._manageMyInfoIcon = this._page.locator(
      '[data-testid="smartPriceScreenManageMyInformation"]'
    );
    this._cardSection = this._page.locator('[data-testid="smartPrice_card"]');
  }

  goToAccountInfoScreen = async () => {
    await this._manageMyInfoIcon.click();
  };

  getCardSection = () => {
    return this._cardSection;
  };
}
