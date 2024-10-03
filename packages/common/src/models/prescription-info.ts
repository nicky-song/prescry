// Copyright 2021 Prescryptive Health, Inc.

import { IDrugPrice } from './drug-price';
import { IPharmacy } from './pharmacy';
import { IPractitioner } from './practitioner';
import { ICouponDetails } from './coupon-details/coupon-details';

export interface IPrescriptionInfo {
  prescriptionId: string;
  primaryMemberRxId?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  drugName: string;
  ndc: string;
  form: string;
  strength?: string;
  unit?: string;
  quantity: number;
  refills: number;
  orderNumber?: string;
  practitioner?: IPractitioner;
  organizationId?: string;
  pharmacy?: IPharmacy;
  orderDate?: Date;
  price?: IDrugPrice;
  authoredOn?: string;
  coupon?: ICouponDetails;
  dosageInstruction?: string;
  blockchain?: boolean;
}
