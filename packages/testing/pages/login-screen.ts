// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class LoginScreen {
  private _page: Page;
  private _createAccountButtonLocator: Locator;
  private _dateOfBirthMonthLocator: Locator;
  private _dateOfBirthYearLocator: Locator;
  private _dateOfBirthDayLocator: Locator;
  private _emailInputLocator: Locator;
  private _firstNameInputLocator: Locator;
  private _lastNameInputLocator: Locator;
  private _memberIdLocator: Locator;
  private _joinButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._firstNameInputLocator = page.locator(
      '[data-testid="loginBody-firstNamePrimaryTextInputTextInput"]'
    );
    this._lastNameInputLocator = page.locator(
      '[data-testid="loginBody-lastNamePrimaryTextInputTextInput"]'
    );
    this._emailInputLocator = page.locator(
      '[data-testid="loginBody-emailAddressPrimaryTextInputTextInput"]'
    );
    this._memberIdLocator = page.locator(
      '[data-testid="loginBody-primaryMemberRxIdPrimaryTextInputTextInput"]'
    );
    this._dateOfBirthDayLocator = page.locator('[data-testid="days"]');
    this._dateOfBirthMonthLocator = page.locator('[data-testid="months"]');
    this._dateOfBirthYearLocator = page.locator('[data-testid="years"]');
    this._createAccountButtonLocator = page.locator(
      '[data-testid="loginScreen-CreateAccount-Button"]'
    );
    this._joinButton = page.locator(
      '[data-testid="loginScreen-AuthJoinEmployerPlan-Button"]'
    );
  }

  fillMemberData = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
  }) => {
    await this._firstNameInputLocator.fill(userData.firstName);
    await this._lastNameInputLocator.fill(userData.lastName);
    await this._emailInputLocator.fill(userData.email);

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

  fillMemberId = (memberId: string) => this._memberIdLocator.fill(memberId);

  confirmMemberCreation = async () => {
    await this._createAccountButtonLocator.click();
  };

  firstName = () => this._firstNameInputLocator;

  lastName = () => this._lastNameInputLocator;

  dateOfBirth = async () => {
    const day = await this._dateOfBirthDayLocator.inputValue();
    const selectedMonth = await this._page.$eval(
      '[data-testid="months"]',
      (sel: HTMLSelectElement) => sel.selectedIndex
    );
    const year = await this._dateOfBirthYearLocator.inputValue();
    if (day && selectedMonth && year) {
      const month = `${selectedMonth}`.padStart(2, '0');
      return new Date(`${year}-${month}-${day}T00:00:00Z`);
    }
  };

  joinMemberButtonDisabled = () => this._joinButton.isDisabled();

  joinMember = () => this._joinButton.click();

  memberSupport = () => this._page.locator('text="Member Support"').click();
}
