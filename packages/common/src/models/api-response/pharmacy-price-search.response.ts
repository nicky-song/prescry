// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { IPharmacyDrugPrice } from '../pharmacy-drug-price';

export type IPharmacyPriceSearchResponse =
  IApiDataResponse<IPharmacyDrugPriceResponse>;
export interface IPharmacyDrugPriceResponse {
  pharmacyPrices: IPharmacyDrugPrice[];
  bestPricePharmacy?: IPharmacyDrugPrice;
}
