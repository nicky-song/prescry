// Copyright 2021 Prescryptive Health, Inc.

export interface ICouponDetails {
  productManufacturerName: string;
  price: number;
  ageLimit: number;
  introductionDialog: string;
  eligibilityURL: string;
  copayText: string;
  copayAmount: number;
  groupNumber: string;
  pcn: string;
  memberId: string;
  bin: string;
  featuredPharmacy: string;
  logo: ICouponDetailsLogo;
}

export interface ICouponDetailsLogo {
  name: string;
  alternativeText: string;
  caption: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  provider: string;
  width: number;
  height: number;
  id: string;
}
