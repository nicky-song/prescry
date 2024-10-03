// Copyright 2018 Prescryptive Health, Inc.

import { IContactInfo } from './contact-info';

export interface IPrescription {
  expiresOn: Date;
  fillOptions: IPrescriptionFillOptions[];
  isNewPrescription?: boolean;
  isPriorAuthRequired?: boolean;
  lastFilledOn?: Date;
  prescribedOn: Date;
  prescriber: IContactInfo;
  referenceNumber: string;
  sig: string;
}

export interface IPrescriptionFillOptions {
  count: number;
  daysSupply?: number;
  authorizedRefills: number;
  fillNumber: number;
}
