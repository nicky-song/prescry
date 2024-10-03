// Copyright 2021 Prescryptive Health, Inc.

import { IHealthRecordEvent } from './health-record-event';

export interface IImmunizationRecord {
  immunizationId: string;
  orderNumber: string;
  manufacturer: string;
  lotNumber: string;
  protocolApplied: IProtocolApplied;
  memberRxId: string;
  vaccineCodes: IVaccineCode[];
}

export interface IProtocolApplied {
  series: string;
  doseNumber: number;
  seriesDoses: number;
}

export interface IVaccineCode {
  code: string;
  system?: string;
  display?: string;
}

export type IImmunizationRecordEvent = IHealthRecordEvent<IImmunizationRecord>;
