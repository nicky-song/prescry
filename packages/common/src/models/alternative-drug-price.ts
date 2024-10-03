// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeMedication } from './alternative-medication';
import { IContactInfo } from './contact-info';
import { IPrescribedMedication } from './prescribed-medication';

export interface IAlternativeDrugPrice {
  prescribedMedication: IPrescribedMedication;
  alternativeMedicationList: IAlternativeMedication[];
  pharmacyInfo: IContactInfo;
}
