// Copyright 2021 Prescryptive Health, Inc.

export interface IConfigureMedicationScreenContent {
  title: string;
  formLabel: string;
  dosageLabel: string;
  supplyLabel: string;
  quantityLabel: string;
  searchButtonLabel: string;
  thirtyDaysLabel: string;
  sixtyDaysLabel: string;
  ninetyDaysLabel: string;
}

export const configureMedicationScreenContent: IConfigureMedicationScreenContent = {
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
