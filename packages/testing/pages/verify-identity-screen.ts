// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class VerifyIdentityScreen {
  private _page: Page;
  private _phoneNumberInput: Locator;
  private _emailAddressInput: Locator;
  private _continueButton: Locator;
  private _dateOfBirthMonthLocator: Locator;
  private _dateOfBirthYearLocator: Locator;
  private _dateOfBirthDayLocator: Locator;
  private _errorMessage: Locator;

  constructor(page: Page) {
    this._page = page;
    this._phoneNumberInput = this._page.locator(
      '[data-testid="verifyIdentityScreenPhoneNumberView"] input'
    );
    this._emailAddressInput = this._page.locator(
      '[data-testid="verifyIdentityScreenView-emailAddress"] input'
    );
    this._continueButton = this._page.locator(
      '[data-testid="verifyIdentityScreenBaseButtonContinue"]'
    );
    this._dateOfBirthDayLocator = page.locator('[data-testid="days"]');
    this._dateOfBirthMonthLocator = page.locator('[data-testid="months"]');
    this._dateOfBirthYearLocator = page.locator('[data-testid="years"]');
    this._errorMessage = this._page.locator(
      '[data-testid="verifyIdentityScreenError"]'
    );
  }

  fillUserData = async (userData: {
    phoneNumber: string;
    email: string;
    dateOfBirth: Date;
  }) => {
    await this._phoneNumberInput.fill(userData.phoneNumber);
    await this._emailAddressInput.fill(userData.email);

    const monthString = userData.dateOfBirth.toLocaleDateString(undefined, {
      month: 'numeric',
      timeZone: 'UTC',
    });
    const dateString = userData.dateOfBirth.toLocaleDateString(undefined, {
      day: '2-digit',
      timeZone: 'UTC',
    });
    const yearString = userData.dateOfBirth.toLocaleDateString(undefined, {
      year: 'numeric',
      timeZone: 'UTC',
    });

    await this._dateOfBirthDayLocator.selectOption(dateString);
    const monthToSelect = (await this._page
      .locator(`[data-testid="datePickerMonth-${monthString}"]`)
      .textContent()) as string;
    await this._dateOfBirthMonthLocator.selectOption({ label: monthToSelect });
    await this._dateOfBirthYearLocator.selectOption(yearString);
  };

  clickContinueButton = async () => {
    await this._continueButton.click();
  };

  getErrorMessage = () => {
    return this._errorMessage;
  };
}
