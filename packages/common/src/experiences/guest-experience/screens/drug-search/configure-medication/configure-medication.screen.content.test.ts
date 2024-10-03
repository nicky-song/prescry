// Copyright 2021 Prescryptive Health, Inc.

import {
  configureMedicationScreenContent,
  IConfigureMedicationScreenContent,
} from './configure-medication.screen.content';

describe('configureMedicationScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IConfigureMedicationScreenContent = {
      title: 'Edit prescription',
      formLabel: 'Form',
      dosageLabel: 'Dosage',
      supplyLabel: 'Days supply',
      quantityLabel: 'Quantity',
      searchButtonLabel: 'Show results',
      thirtyDaysLabel: '30 Days',
      sixtyDaysLabel: '60 Days',
      ninetyDaysLabel: '90 Days',
    };

    expect(configureMedicationScreenContent).toEqual(expectedContent);
  });
});
