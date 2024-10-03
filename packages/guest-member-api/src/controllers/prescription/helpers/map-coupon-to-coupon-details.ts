// Copyright 2021 Prescryptive Health, Inc.

import { ICoupon } from '../../../models/coupon';
import {
  ICouponDetails,
  ICouponDetailsLogo,
} from '@phx/common/src/models/coupon-details/coupon-details';

export const mapCouponToCouponDetails = (coupon: ICoupon): ICouponDetails => ({
  productManufacturerName: coupon.ProductManufacturerName || '',
  price: coupon.MaxPrice || 0,
  ageLimit: coupon.AgeLimit || 0,
  introductionDialog: coupon.IntroductionDialog || '',
  eligibilityURL: coupon.EligibilityURL || '',
  copayText: coupon.CopayText || '',
  copayAmount: coupon.CopayAmount || 0,
  groupNumber: coupon.GroupNumber || '',
  pcn: coupon.PCN || '',
  memberId: coupon.MemberId || '',
  bin: coupon.BIN || '',
  featuredPharmacy: coupon.FeaturedCouponProvider?.NCPDP || '',
  logo: coupon.Logo || ({} as ICouponDetailsLogo),
});
