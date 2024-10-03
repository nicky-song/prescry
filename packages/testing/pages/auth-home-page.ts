// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class AuthHomePage {
  private readonly _page: Page;
  private readonly _buttonHamburguerMenu: Locator;
  private readonly _buttonMemberIdCard: Locator;
  private readonly _buttonSignOutMenu: Locator;
  private readonly _buttonFavoritePharmaciesMenu: Locator;

  constructor(page: Page) {
    this._page = page;
    this._buttonHamburguerMenu = page.locator(
      '[data-testid="homeScreenHeaderDrawerHamburgerButton"]'
    );
    this._buttonSignOutMenu = page.locator(
      '[data-testid="sideMenuAuthDrawerItemsSideMenuDrawerItemSignOut"]'
    );
    this._buttonFavoritePharmaciesMenu = page.locator(
      '[data-testid="sideMenuAuthDrawerFavoritePharmaciesSideMenuDrawerItem"]'
    );
    this._buttonMemberIdCard = this._page.locator(
      `[data-testid="sideMenuAuthDrawerIdCardSideMenuDrawerItem"]`
    );
  }

  goToSignOut = async () => {
    await this._buttonHamburguerMenu.click();
    await this._buttonSignOutMenu.click();
  };

  goToFavoritePharmacies = async () => {
    await this._buttonHamburguerMenu.click();
    await this._buttonFavoritePharmaciesMenu.click();
  };

  memberIdCard = async () => {
    await this._buttonHamburguerMenu.click();
    await this._buttonMemberIdCard.click();
  };
}
