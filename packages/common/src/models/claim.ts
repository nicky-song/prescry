// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from './pharmacy';
import { IPractitioner } from './practitioner';

export interface IClaimBilling {
  memberPays: number;
  deductibleApplied: number;
}

export type IClaimPharmacy = Pick<IPharmacy, 'ncpdp' | 'name' | 'phoneNumber'>;

export interface IClaim {
  prescriptionId: string;
  drugName: string;
  ndc: string;
  formCode: string;
  strength?: string;
  quantity: number;
  daysSupply?: number;
  refills: number;
  orderNumber?: string;
  practitioner: IPractitioner;
  pharmacy: IClaimPharmacy;
  filledOn?: Date;
  billing: IClaimBilling;
}

export interface IClaimHistory {
  claims: IClaim[];
  claimPdf?: string;
}
