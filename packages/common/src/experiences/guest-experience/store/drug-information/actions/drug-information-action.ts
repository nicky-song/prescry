// Copyright 2021 Prescryptive Health, Inc.

export type DrugInformationActionKeys = 'DRUG_INFORMATION_RESPONSE';

export interface IDrugInformationAction<
  T extends DrugInformationActionKeys,
  P
> {
  type: T;
  payload: P;
}
