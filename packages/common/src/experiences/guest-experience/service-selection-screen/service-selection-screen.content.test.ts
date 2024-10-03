// Copyright 2021 Prescryptive Health, Inc.

import {
  IServiceSelectionScreenContent,
  serviceSelectionScreenContent,
} from './service-selection-screen.content';

describe('serviceSelectionScreenContent', () => {
  it('has expected result-agnostic styles', () => {
    const expectedContent: IServiceSelectionScreenContent = {
      title: `Select a service`,
      moreInfoVaccineLink: `[Learn more about COVID-19 vaccine](https://www.cdc.gov/coronavirus/2019-ncov/vaccines/expect.html)`,
    };

    expect(serviceSelectionScreenContent).toEqual(expectedContent);
  });
});
