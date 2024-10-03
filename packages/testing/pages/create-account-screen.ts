// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class CreateAccountScreen {
  private _page: Page;
  private _bodyContentContainer: Locator;
  private _continueButton: Locator;
  private _headerSection: Locator;
  private _accountError: Locator;
  private _firstNameInputLocator: Locator;
  private _lastNameInputLocator: Locator;
  private _emailInputLocator: Locator;
  private _phoneNumber: Locator;
  private _checkBox: Locator;
  private _dateOfBirthMonthLocator: Locator;
  private _dateOfBirthYearLocator: Locator;
  private _dateOfBirthDayLocator: Locator;
  private _memberId: Locator;
  private _createAccountMemberIdContactUs: Locator;

  constructor(page: Page) {
    this._page = page;
    this._continueButton = this._page.locator(
      '[data-testid="createAccountScreenContinueButton"]'
    );
    this._headerSection = this._page.locator(
      '[data-testid="createAccountScreenHeader"]'
    );
    this._accountError = this._page.locator(
      '[data-testid="createAccountScreenAccountError"]'
    );
    this._bodyContentContainer = this._page.locator(
      '[data-testid="createAccountScreenBodyContentContainer"]'
    );
    this._firstNameInputLocator = this._page.locator(
      '[data-testid="createAccountBodyPrimaryTextInputFirstNameTextInput"]'
    );
    this._lastNameInputLocator = this._page.locator(
      '[data-testid="createAccountBodyPrimaryTextInputLastNameTextInput"]'
    );
    this._emailInputLocator = this._page.locator(
      '[data-testid="createAccountBodyPrimaryTextInputEmailAddressTextInput"]'
    );
    this._phoneNumber = this._page.locator(
      '[data-testid="phoneMaskInputPrimaryTextInputPhoneNumberTextInput"]'
    );

    this._checkBox = this._page.locator(
      '[data-testid="chktermsAndConditions"]'
    );
    this._dateOfBirthDayLocator = this._page.locator('[data-testid="days"]');
    this._dateOfBirthMonthLocator = this._page.locator(
      '[data-testid="months"]'
    );
    this._dateOfBirthYearLocator = this._page.locator('[data-testid="years"]');
    this._memberId = page.locator('[data-testid="txt_memberId"]');
    this._createAccountMemberIdContactUs = page.locator(
      '[data-testid="createAccountMemberIdContactUs"]'
    );
  }

  fillAccountData = async (userData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: Date;
    uniqueId?: string;
  }) => {
    await this._firstNameInputLocator.fill(userData.firstName);
    await this._lastNameInputLocator.fill(userData.lastName);
    await this._emailInputLocator.fill(userData.email);
    await this._phoneNumber.fill(userData.phoneNumber);

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

    if (userData.uniqueId) {
      await this._memberId.locator('input').fill(userData.uniqueId);
    }
    await this._checkBox.click({
      position: { x: 0, y: 0 },
    });
  };

  clickContinueButton = async () => {
    await this._continueButton.click();
  };

  getBodyContentContainer = () => {
    return this._bodyContentContainer;
  };

  accountError = () => this._accountError;

  async headerContactUs(contactUsUri: string, contactUsText: string) {
    const requestPromise = this._page.waitForRequest(contactUsUri);
    await this._headerSection
      .locator('span span span', { hasText: contactUsText })
      .click();
    return requestPromise;
  }

  async memberContactUs(contactUsUri: string, contactUsText: string) {
    const requestPromise = this._page.waitForRequest(contactUsUri);
    await this._createAccountMemberIdContactUs
      .locator('span span span', { hasText: contactUsText })
      .click();
    return requestPromise;
  }
}
