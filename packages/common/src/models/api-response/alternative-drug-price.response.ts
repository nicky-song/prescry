// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeMedication } from '../alternative-medication';
import { IApiDataResponse } from '../api-response';
import { IContactInfo } from '../contact-info';
import { IPrescribedMedication } from '../prescribed-medication';

export type IAlternativeDrugPriceSearchResponse =
  IApiDataResponse<IAlternativeDrugPriceResponse>;

export interface IAlternativeDrugPriceResponse {
  prescribedMedication: IPrescribedMedication;
  alternativeMedicationList: IAlternativeMedication[];
  pharmacyInfo: IContactInfo;
}
