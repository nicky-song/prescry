// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class WhatComesNextScreen {
  private _page: Page;
  private _favoritePharmacyIcon: Locator;
  private _buttonHamburguerMenu: Locator;
  private _buttonFavoritePharmaciesMenu: Locator;
  private _buttonThisPharmacySectionSignUp: Locator;
  private _actionCardPillBottleIconButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._favoritePharmacyIcon = this._page.locator(
      '[data-testid="favoriteIconButtonInBodyContentContainer"]'
    );
    this._buttonHamburguerMenu = this._page.locator(
      '[data-testid="whatComesNextScreenHeaderHamburgerButton"]'
    );
    this._buttonFavoritePharmaciesMenu = this._page.locator(
      '[data-testid="sideMenuAuthDrawerFavoritePharmaciesSideMenuDrawerItem"]'
    );
    this._buttonThisPharmacySectionSignUp = this._page.locator(
      '[data-testid="prescriptionAtThisPharmacySectionSignUpButton"]'
    );
    this._actionCardPillBottleIconButton = this._page.locator(
      '[data-testid="actionCardPillBottleIcon"]'
    );
  }

  setUnsetFavoritePharmacy = async () => {
    await this._favoritePharmacyIcon.click();
  };

  goToFavoritePharmacies = async () => {
    await this._buttonHamburguerMenu.click();
    await this._buttonFavoritePharmaciesMenu.click();
  };

  clickSignUpForMoreSavings = async () => {
    await this._buttonThisPharmacySectionSignUp.click();
  };

  clickActionCardPillBottleIcon = async () => {
    await this._actionCardPillBottleIconButton.click();
  };
}
