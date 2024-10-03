// Copyright 2023 Prescryptive Health, Inc.

import { Page } from '@playwright/test';

export class PastProceduresListScreen {
  private _page: Page;

  constructor(page: Page) {
    this._page = page;
  }

  getProcedureLocatorItemForOrderNumber = (orderNumber: string) =>
    this._page.getByTestId(`titlePropertiesItem-${orderNumber}`);
}
