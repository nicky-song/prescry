// Copyright 2021 Prescryptive Health, Inc.

import { IMemberAddress } from './create-booking.request-body';

export interface ITransferPrescriptionRequestBody {
  sourceNcpdp: string;
  destinationNcpdp: string;
  ndc: string;
  daysSupply: number;
  quantity: number;
  memberAddress?: IMemberAddress;
  prescriptionNumber?: string;
}
