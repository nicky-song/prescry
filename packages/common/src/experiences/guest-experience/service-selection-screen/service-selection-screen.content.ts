// Copyright 2021 Prescryptive Health, Inc.

export interface IServiceSelectionScreenContent {
  title: string;
  moreInfoVaccineLink: string;
}

export const serviceSelectionScreenContent: IServiceSelectionScreenContent = {
  title: `Select a service`,
  moreInfoVaccineLink: `[Learn more about COVID-19 vaccine](https://www.cdc.gov/coronavirus/2019-ncov/vaccines/expect.html)`,
};
