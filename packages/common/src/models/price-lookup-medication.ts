// Copyright 2019 Prescryptive Health, Inc.

import { IMedication } from './medication';

export interface IPriceLookupMedication extends IMedication {
  brandNameCode: string;
  multiSourceCode: string;
  ndc: string;
  packageQuantity: number;
  packageTypeCode: string;
}
