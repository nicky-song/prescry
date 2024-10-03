// Copyright 2022 Prescryptive Health, Inc.

import { IPrescriptionDetails } from '../models/prescription-details';
import { IDrugPricing } from '../models/drug-pricing';

export interface IAlternativeMedication {
  memberSaves: number;
  planSaves: number;
  prescriptionDetailsList: IPrescriptionDetails[];
  drugPricing: IDrugPricing;
}
