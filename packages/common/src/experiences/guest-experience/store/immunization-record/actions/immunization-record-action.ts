// Copyright 2021 Prescryptive Health, Inc.

export enum ImmunizationRecordActionKeysEnum {
  IMMUNIZATION_RECORD_RESPONSE = 'IMMUNIZATION_RECORD_RESPONSE',
}
export type ImmunizationRecordActionKeys =
  keyof typeof ImmunizationRecordActionKeysEnum;

export interface IImmunizationRecordAction<
  T extends ImmunizationRecordActionKeys,
  P
> {
  type: T;
  payload: P;
}
