// Copyright 2022 Prescryptive Health, Inc.

import { IDrugDetails } from '../utils/formatters/drug.formatter';

export interface IPrescribedMedication {
  drugName: string;
  drugDetails: IDrugDetails;
  price: number;
  planPrice: number;
  orderDate: string;
}
