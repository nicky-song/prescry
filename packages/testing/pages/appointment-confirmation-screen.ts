// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class AppointmentConfirmationScreen {
  private _page: Page;
  private _appointmentConfirmationTitle: Locator;
  private _cancelAppointmentButton: Locator;
  private _keepAppointmentModalButton: Locator;
  private _confirmCancellationAppointmentModalButton: Locator;
  private _orderNumberContainer: Locator;
  private _homeButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._appointmentConfirmationTitle = page.locator(
      '[data-testid="appointmentConfirmationView"] h1'
    );
    this._cancelAppointmentButton = page.locator(
      '[data-testid="appointmentConfirmationCancelButton"]'
    );
    this._keepAppointmentModalButton = page.locator(
      '[data-testid="appointmentConfirmationPopupModelKeepButton"]'
    );
    this._confirmCancellationAppointmentModalButton = page.locator(
      '[data-testid="appointmentConfirmationPopupModelCancelButton"]'
    );
    this._orderNumberContainer = page
      .locator('[data-testid="Order number"]')
      .locator('div')
      .locator('nth=1');

    this._homeButton = page.locator(
      '[data-testid="appointmentConfirmationHomeButton"]'
    );
  }

  appointmentCancelButtonLocator = () => this._cancelAppointmentButton;

  cancelAppointment = () => this._cancelAppointmentButton.click();

  regretForAppointmentCancellation = () =>
    this._keepAppointmentModalButton.click();

  confirmAppointmentCancellation = () =>
    this._confirmCancellationAppointmentModalButton.click();

  getAppointmentNumber = () => this._orderNumberContainer.innerText();

  goHome = () => this._homeButton.click();
}
