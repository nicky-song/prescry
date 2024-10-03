// Copyright 2023 Prescryptive Health, Inc.

import { Page } from '@playwright/test';
import { SlideUpModal } from '../slide-up-modal';

export class SwitchYourMedicationSlideUpModal extends SlideUpModal {
  constructor(page: Page) {
    super(page);
  }

  scrollNoCobranding = async () => {
    const locator = this._container.locator('div div div h3');
    for (let index = 0; index < 3; index++) {
      await locator.nth(index).scrollIntoViewIfNeeded();
    }
    return this;
  };
}
