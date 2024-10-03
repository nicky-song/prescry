// Copyright 2021 Prescryptive Health, Inc.

import {
  ICouponDetails,
  ICouponDetailsLogo,
} from '../../../models/coupon-details/coupon-details';
import { couponLogoMock } from './coupon-logo.mock';

export const couponDetailsMock1: ICouponDetails = {
  productManufacturerName: 'product-manugacturer-name-1',
  price: 1,
  ageLimit: 1,
  introductionDialog: 'introduction-dialog-1',
  eligibilityURL: 'eligibility-url-1',
  copayText: 'copay-text-1',
  copayAmount: 1,
  groupNumber: 'group-number-1',
  pcn: 'pcn-1',
  memberId: 'member-id-1',
  bin: 'bin-1',
  featuredPharmacy: 'featured-pharmacy-1',
  logo: couponLogoMock,
};

export const couponDetailsMock2: ICouponDetails = {
  productManufacturerName: 'product-manugacturer-name-2',
  price: 2,
  ageLimit: 2,
  introductionDialog: 'introduction-dialog-2',
  eligibilityURL: 'eligibility-url-2',
  copayText: 'copay-text-2',
  copayAmount: 2,
  groupNumber: 'group-number-2',
  pcn: 'pcn-2',
  memberId: 'member-id-2',
  bin: 'bin-2',
  featuredPharmacy: 'featured-pharmacy-2',
  logo: couponLogoMock,
};

export const couponDetailsMock3: ICouponDetails = {
  productManufacturerName: 'product-manugacturer-name-3',
  price: 3,
  ageLimit: 3,
  introductionDialog: 'introduction-dialog-3',
  eligibilityURL: 'eligibility-url-3',
  copayText: 'copay-text-3',
  copayAmount: 3,
  groupNumber: 'group-number-3',
  pcn: 'pcn-3',
  memberId: 'member-id-3',
  bin: 'bin-3',
  featuredPharmacy: 'featured-pharmacy-3',
  logo: {
    name: 'logo',
  } as ICouponDetailsLogo,
};
