// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class UnauthHomePage {
  private readonly _page: Page;
  private readonly _buttonJoinEmployerPlan: Locator;
  private readonly _buttonBookClinicalService: Locator;
  private readonly _buttonHamburgerMenu: Locator;
  private readonly _buttonSignInMenu: Locator;
  private readonly _buttonDrugSearchCard: Locator;

  constructor(page: Page) {
    this._page = page;
    this._buttonJoinEmployerPlan = this._page.locator(
      '[data-testid="unauthHomeButtonJoinEmployerPlan"]'
    );
    this._buttonBookClinicalService = this._page.locator(
      '[data-testid="unauthHomeCardClinicalServicesBookNowButton"]'
    );
    this._buttonHamburgerMenu = this._page.locator(
      '[data-testid="unauthHomeScreenHeaderDrawerHamburgerButton"]'
    );
    this._buttonSignInMenu = this._page.locator(
      '[data-testid="sideMenuHeaderSignInButton"]'
    );
    this._buttonDrugSearchCard = this._page.locator(
      '[data-testid="drugSearchCardSearchButton"]'
    );
  }

  async goto() {
    await this._page.goto('/');
  }

  async joinEmployerPlanButtonClick() {
    await this._buttonJoinEmployerPlan.click();
  }

  async bookClinicalService() {
    await this._buttonBookClinicalService.click();
  }

  async goToLogin() {
    await this._buttonHamburgerMenu.click();
    await this._buttonSignInMenu.click();
  }

  async clickDrugSearch() {
    await this._buttonDrugSearchCard.click();
  }
}
