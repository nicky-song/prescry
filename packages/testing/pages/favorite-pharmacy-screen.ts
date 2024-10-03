// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class FavoritePharmacyScreen {
  private _page: Page;
  private _favoritePharmacyCardFirstItem: Locator;
  private _iconButtonOnFavoritePharmacyCardFirstItem: Locator;

  constructor(page: Page) {
    this._page = page;
    this._favoritePharmacyCardFirstItem = this._page
      .locator('[data-testid^="favoritePharmacyCard"]')
      .first();

    this._iconButtonOnFavoritePharmacyCardFirstItem = this._page
      .locator('[data-testid^="favoriteIconButtonOnFavoritePharmacyCard"]')
      .first();
  }

  removeFirstFavoritePharmacy = async () => {
    await this._favoritePharmacyCardFirstItem.waitFor();
    await this._iconButtonOnFavoritePharmacyCardFirstItem.click();
  };

  getFavoritePharmacyCardByTestId = (testID: string) => {
    return this._page.locator(`[data-testid="favoritePharmacyCard-${testID}"]`);
  };
}
