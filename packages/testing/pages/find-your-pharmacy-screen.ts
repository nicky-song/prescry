// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class FindYourPharmacyScreen {
  private _page: Page;
  private _searchInput: Locator;
  private _searchButton: Locator;
  private _findYourPharmacyScreenPharmacyItem: Locator;

  constructor(page: Page) {
    this._page = page;
    this._searchInput = this._page.locator(
      '[data-testid="findYourPharmacySearchBox-inputTextInput"]'
    );
    this._searchButton = this._page.locator(
      '[data-testid="findYourPharmacySearchBox-search"]'
    );
    this._findYourPharmacyScreenPharmacyItem = this._page
      .locator('[data-testid^="findYourPharmacyCard-"]')
      .first();
  }

  enterPharmacyCode = async (pharmacyCode: string) => {
    await this._searchInput.type(pharmacyCode);
  };

  clickSearchPharmacy = async () => {
    await this._searchButton.click();
  };

  getFindYourPharmacyCardFirstItem = async () => {
    await this._findYourPharmacyScreenPharmacyItem.click();
  };
}
