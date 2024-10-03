// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class RecommendedAlternativesScreen {
  private readonly _page: Page;
  private readonly _keepCurrentPrescriptionButton: Locator;
  private readonly _recommendedAlternativesCustomerSupport: Locator;
  private readonly _learnMoreIcon: Locator;
  private readonly _firstAlternativeMedication: Locator;
  private readonly _secondAlternativeMedication: Locator;
  private MemberSavesTagTestId = 'memberSavesTag';
  private PlanSavesTagTestId = 'planSavesTag';

  constructor(page: Page) {
    this._page = page;
    this._keepCurrentPrescriptionButton = this._page.locator(
      '[data-testid="keepCurrentPrescriptionButton"]'
    );
    this._recommendedAlternativesCustomerSupport = this._page.locator(
      '[data-testid="recommendedAlternativesCustomerSupport"]'
    );
    this._learnMoreIcon = this._page.locator('[data-testid=learnMoreIcon]');
    this._firstAlternativeMedication = this._page.getByTestId(
      'alternativeMedication0'
    );
    this._secondAlternativeMedication = this._page.getByTestId(
      'alternativeMedication1'
    );
  }

  keepCurrentPrescription = async () => {
    await this._keepCurrentPrescriptionButton.click();
  };

  contactSupport = async () => {
    await this._recommendedAlternativesCustomerSupport.click();
  };

  learnMore = async () => {
    await this._learnMoreIcon.click();
  };

  closeLearnMore = async () => {
    await this._page.getByTestId('modalCloseButton').click();
  };

  getFirstMedicationReplacementLocatorTags = () => {
    return [
      this._firstAlternativeMedication.getByTestId(this.MemberSavesTagTestId),
      this._firstAlternativeMedication.getByTestId(this.PlanSavesTagTestId),
    ];
  };

  getSecondMedicationReplacementLocatorTags = () => {
    return [
      this._secondAlternativeMedication.getByTestId(this.MemberSavesTagTestId),
      this._secondAlternativeMedication.getByTestId(this.PlanSavesTagTestId),
    ];
  };
}
