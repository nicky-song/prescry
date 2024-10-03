// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from './pharmacy';
import { IDrugPrice, IDualDrugPrice } from './drug-price';
import { ICouponDetails } from './coupon-details/coupon-details';

export interface IPharmacyDrugPrice {
  pharmacy: IPharmacy;
  price?: IDrugPrice;
  dualPrice?: IDualDrugPrice;
  coupon?: ICouponDetails;
  otherPharmacies?: IPharmacyDrugPrice[];
}
