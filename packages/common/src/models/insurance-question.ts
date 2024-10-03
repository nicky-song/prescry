// Copyright 2022 Prescryptive Health, Inc.

export interface IInsuranceQuestion {
  id: string;
  label: string;
  markdownLabel: string;
  placeholder?: string;
  description?: string;
  selectOptions?: [string, string][];
  validation?: string;
}
