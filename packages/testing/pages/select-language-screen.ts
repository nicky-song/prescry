// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class SelectLanguageScreen {
  private _page: Page;

  private _languageRadioButton: Locator;
  private _buttonHamburguerMenu: Locator;
  private _buttonLanguageMenu: Locator;

  constructor(page: Page) {
    this._page = page;
    this._buttonHamburguerMenu = page.locator(
      '[data-testid="homeScreenHeaderDrawerHamburgerButton"]'
    );
    this._buttonLanguageMenu = page.locator(
      '[data-testid="sideMenuAuthDrawerLanguageSideMenuDrawerItem"]'
    );
  }

  async goToLanguageSetting() {
    await this._buttonHamburguerMenu.click();
    await this._buttonLanguageMenu.click();
  }

  changeLanguage = async (languageToChange: string) => {
    this._languageRadioButton = this._page.locator(
      `[data-testid="radioButtonToggleRadioButton-${languageToChange}Touchable"]`
    );
    await this._languageRadioButton.click();
  };
}
