// Copyright 2021 Prescryptive Health, Inc.

import { IHealthRecordEvent } from './health-record-event';
import { ICouponDetails } from '@phx/common/src/models/coupon-details/coupon-details';

export interface IPrescriptionPrice {
  prescriptionId: string;
  memberId: string;
  daysSupply: number;
  pharmacyId: string;
  fillDate: string;
  ndc: string;
  planPays?: number;
  memberPays?: number;
  pharmacyTotalPrice?: number;
  quantity: number;
  type: 'prescription' | 'transferRequest';
  coupon?: ICouponDetails | undefined;
}
export type IPrescriptionPriceEvent = IHealthRecordEvent<IPrescriptionPrice>;
