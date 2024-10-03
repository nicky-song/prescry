// Copyright 2021 Prescryptive Health, Inc.

export interface IVaccinationRecordScreenContent {
  title: string;
  factSheetText: string;
  vSafeText: string;
  vSafeTextLink: string;
}

export const vaccinationRecordScreenContent: IVaccinationRecordScreenContent = {
  title: `Vaccination record`,
  factSheetText: `Fact sheet for patients`,
  vSafeText: `Learn more about V-Safe`,
  vSafeTextLink: `https://vsafe.cdc.gov/`,
};
