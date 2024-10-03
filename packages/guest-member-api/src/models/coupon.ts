// Copyright 2021 Prescryptive Health, Inc.

export interface ICouponProvider {
  _id: string;
  Zip: string;
  NPIId: string;
  NCPDP: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  Name: string;
  Phone: string;
  State: string;
  published_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  created_by: string;
  updated_by: string;
  id: string;
}

export interface ICouponLogo {
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

export interface ICoupon {
  ProductId: string;
  Quantity: number;
  ProductManufacturerName: string;
  FeaturedCouponProvider?: ICouponProvider;
  CouponProviders: ICouponProvider[];
  MaxPrice: number;
  AgeLimit: number;
  IntroductionDialog: string;
  EligibilityURL: string;
  CopayText: string;
  CopayAmount: number;
  GroupNumber: string;
  PCN: string;
  MemberId: string;
  BIN: string;
  Logo?: ICouponLogo;
}
