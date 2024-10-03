// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class AppointmentScreen {
  private _page: Page;
  private _timePicker: Locator;
  private _nextMonthCalendarButton: Locator;
  private _memberAddress: {
    street: string;
    city: string;
    zipCode: string;
    county?: string;
    stateAbbreviation: string;
  };
  private _street: Locator;
  private _city: Locator;
  private _zipCode: Locator;
  private _county: Locator;
  private _state: Locator;
  private _appointmentRequestForMySelf: Locator;
  private _appointmentRequestForDependent: Locator;
  private _termsAndConditionsCheck: Locator;

  constructor(page: Page) {
    this._page = page;
    this._timePicker = this._page.locator('[data-testid="picker"]');
    this._nextMonthCalendarButton = this._page.locator(
      '[data-testid="native.calendar.CHANGE_MONTH_RIGHT_ARROW"]'
    );

    this._street = this._page.locator(
      '[data-testid="appointment-address1PrimaryTextInputTextInput"]'
    );
    this._city = this._page.locator(
      '[data-testid="appointment-cityPrimaryTextInputTextInput"]'
    );
    this._zipCode = this._page.locator(
      '[data-testid="appointment-zipPrimaryTextInputTextInput"]'
    );
    this._county = this._page.locator(
      '[data-testid="appointment-countyPrimaryTextInputTextInput"]'
    );
    this._state = this._page.locator(
      '[data-testid="appointment-stateBasePicker"]'
    );
    this._appointmentRequestForMySelf = this._page.locator(
      '[data-testid="appointmentRadio-MyselfTouchable"]'
    );
    this._appointmentRequestForDependent = this._page.locator(
      '[data-testid="appointmentRadio-For another personTouchable"]'
    );
    this._termsAndConditionsCheck = this._page.locator(
      '[data-testid="appointmentTermsAndConditionsLinkCheckBoxTouchable"]'
    );
  }

  moveCalendarToNextMonth = () => this._nextMonthCalendarButton.click();

  selectAppointmentSlot = async (slotDay: string, slotName: string) => {
    const fixedCalendarDayTestId = 'native.calendar.SELECT_DATE_SLOT-';
    const dateSlotLocator = this._page.locator(
      `[data-testid="${fixedCalendarDayTestId}${slotDay}"]`
    );
    await dateSlotLocator.click();

    await this._timePicker.selectOption({
      label: slotName,
    });
  };

  fillMemberAddress = async (address: typeof this._memberAddress) => {
    await this._street.fill(address.street);
    await this._city.fill(address.city);
    await this._zipCode.fill(address.zipCode);
    if (address.county) await this._county.fill(address.county);
    await this._state.selectOption({
      value: `${address.stateAbbreviation}`,
    });
    this._memberAddress = address;
  };

  selectAppointmentForMyself = async () => {
    await this._appointmentRequestForMySelf.click();
  };

  selectAppointmentForDependent = async () => {
    await this._appointmentRequestForDependent.click();
  };

  async answerQuestion(question: {
    id: string;
    type: 'text';
    value: string;
  }): Promise<void>;
  async answerQuestion(question: {
    id: string;
    type: 'single-select';
    value: string;
  }): Promise<void>;
  async answerQuestion(question: {
    id: string;
    type: 'multi-select';
    values: string[];
  }): Promise<void>;
  async answerQuestion(question: {
    id: string;
    type: 'datepicker';
    value: { month: string; day: string; year: string };
  }): Promise<void>;
  async answerQuestion(
    question: Required<
      | { type: 'text'; value: string }
      | { type: 'single-select'; value: string }
      | { type: 'multi-select'; values: string[] }
      | {
          type: 'datepicker';
          value: { month: string; day: string; year: string };
        }
    > & { id: string }
  ) {
    if (question.type === 'text') {
      const surveyTextElement = this._page.locator(
        `[data-testid="surveyItemId${question.id}TextInput"]`
      );
      await surveyTextElement.fill(question.value);
    }
    if (question.type === 'single-select') {
      const surveySingleSelectElement = this._page.locator(
        `[data-testid="surveyItemId${question.id}BasePicker"]`
      );
      await surveySingleSelectElement.selectOption(question.value);
    }
    if (question.type === 'multi-select') {
      for (const value of question.values) {
        const checkElement = this._page.locator(
          `[data-testid="surveyItemId${question.id}-${value}CheckTouchable"]`
        );
        await checkElement.click();
      }
    }
    if (question.type === 'datepicker') {
      const surveyDatePickerMonthElement = this._page.locator(
        `[data-testid="surveyItemId${question.id}InputMonthPicker"]`
      );
      await surveyDatePickerMonthElement.selectOption(question.value.month);
      const surveyDatePickerDayElement = this._page.locator(
        `[data-testid="surveyItemId${question.id}InputDayInput"]`
      );
      await surveyDatePickerDayElement.fill(question.value.day);
      const surveyDatePickerYearElement = this._page.locator(
        `[data-testid="surveyItemId${question.id}InputYearInput"]`
      );
      await surveyDatePickerYearElement.fill(question.value.year);
    }
  }

  acceptTermsAndConditions = async () => {
    await this._termsAndConditionsCheck.click();
  };

  submitAppointmentCreation = async (servicePaymentRequired: boolean) => {
    let bookButton: Locator;
    if (servicePaymentRequired) {
      bookButton = this._page.getByTestId(`appointmentScreen-Continue-Button`);
    } else {
      bookButton = this._page.getByTestId(`appointmentScreen-Book-Button`);
    }

    await bookButton.click();
  };
}
