// Copyright 2021 Prescryptive Health, Inc.

import { IDrugConfiguration } from '../../../../models/drug-configuration';
import { IDrugSearchResult } from '../../../../models/drug-search-response';
import { IPharmacy } from '../../../../models/pharmacy';
import { IPharmacyDrugPrice } from '../../../../models/pharmacy-drug-price';

export interface IDrugSearchState {
  drugSearchResults: IDrugSearchResult[];
  pharmacies: IPharmacyDrugPrice[];
  sourcePharmacies: IPharmacy[];
  timeStamp: number;
  isGettingPharmacies: boolean;
  selectedDrug?: IDrugSearchResult;
  selectedConfiguration?: IDrugConfiguration;
  bestPricePharmacy?: IPharmacyDrugPrice;
  errorMessage?: string;
  selectedPharmacy?: IPharmacyDrugPrice;
  selectedSourcePharmacy?: IPharmacy;
  invalidZipErrorMessage?: string;
  noPharmaciesFound?: boolean;
}

export const defaultDrugSearchState: IDrugSearchState = {
  drugSearchResults: [],
  pharmacies: [],
  sourcePharmacies: [],
  noPharmaciesFound: false,
  timeStamp: 0,
  isGettingPharmacies: false,
};
