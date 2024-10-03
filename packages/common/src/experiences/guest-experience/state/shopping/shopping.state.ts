// Copyright 2021 Prescryptive Health, Inc.

import { IAlternativeDrugPrice } from '../../../../models/alternative-drug-price';
import { IDrugInformationItem } from '../../../../models/api-response/drug-information-response';
import { IPharmacyDrugPrice } from '../../../../models/pharmacy-drug-price';
import { IPrescriptionInfo } from '../../../../models/prescription-info';

export interface IShoppingState {
  prescriptionInfo?: IPrescriptionInfo;
  bestPricePharmacy?: IPharmacyDrugPrice;
  prescriptionPharmacies: IPharmacyDrugPrice[];
  drugInformation?: IDrugInformationItem;
  errorMessage?: string;
  noPharmaciesFound?: boolean;
  isGettingPharmacies: boolean;
  alternativeDrugPrice?: IAlternativeDrugPrice;
  hasInsurance?: boolean;
}

export const defaultShoppingState: IShoppingState = {
  prescriptionPharmacies: [],
  noPharmaciesFound: false,
  isGettingPharmacies: false,
};
