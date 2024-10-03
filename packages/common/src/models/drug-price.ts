// Copyright 2021 Prescryptive Health, Inc.

export interface IDrugPrice {
  memberPays: number;
  planPays: number;
  pharmacyTotalPrice: number;
  insurancePrice?: number;
}

export type PbmType = 'phx' | 'thirdParty' | 'none';

export interface IDualDrugPrice {
  smartPriceMemberPays?: number;
  pbmType: PbmType;
  pbmMemberPays?: number;     // phx or 3rd party
  pbmPlanPays?: number;
}
