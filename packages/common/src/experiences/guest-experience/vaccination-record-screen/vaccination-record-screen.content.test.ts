// Copyright 2021 Prescryptive Health, Inc.

import {
  IVaccinationRecordScreenContent,
  vaccinationRecordScreenContent,
} from './vaccination-record-screen.content';

describe('VaccinationRecordScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IVaccinationRecordScreenContent = {
      title: `Vaccination record`,
      factSheetText: `Fact sheet for patients`,
      vSafeText: `Learn more about V-Safe`,
      vSafeTextLink: `https://vsafe.cdc.gov/`,
    };

    expect(vaccinationRecordScreenContent).toEqual(expectedContent);
  });
});
