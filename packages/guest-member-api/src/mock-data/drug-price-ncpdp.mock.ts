// Copyright 2021 Prescryptive Health, Inc.

import { IDrugPriceNcpdp } from '../models/drug-price-ncpdp';

export const smartPriceMock1: IDrugPriceNcpdp = {
  ncpdp: '4902234',
  price: {
    planPays: 0,
    pharmacyTotalPrice: 33.7,
    memberPays: 33.7,
    insurancePrice: 23.45,
  },
  dualPrice: {
    smartPriceMemberPays: 40,
    pbmType: 'thirdParty',
    pbmMemberPays: 23.45,
  },
};

export const smartPriceMock2: IDrugPriceNcpdp = {
  ncpdp: '4921575',
  price: {
    planPays: 0,
    pharmacyTotalPrice: 34,
    memberPays: 34,
    insurancePrice: 23.45,
  },
  dualPrice: {
    smartPriceMemberPays: 40,
    pbmType: 'thirdParty',
    pbmMemberPays: 23.45,
  },
};

export const smartPriceMock3: IDrugPriceNcpdp = {
  ncpdp: '3845798',
  price: {
    planPays: 0,
    pharmacyTotalPrice: 35,
    memberPays: 35,
    insurancePrice: 23.45,
  },
  dualPrice: {
    smartPriceMemberPays: 40,
    pbmType: 'thirdParty',
    pbmMemberPays: 23.45,
  },
};

export const smartPriceMock4: IDrugPriceNcpdp = {
  ncpdp: '3815341',
  price: {
    planPays: 0,
    pharmacyTotalPrice: 34,
    memberPays: 34,
    insurancePrice: 23.45,
  },
  dualPrice: {
    smartPriceMemberPays: 40,
    pbmType: 'thirdParty',
    pbmMemberPays: 23.45,
  },
};

export const featuredPharmacyPriceMock: IDrugPriceNcpdp = {
  ncpdp: '0000002',
  price: {
    planPays: 0,
    pharmacyTotalPrice: 20,
    memberPays: 20,
    insurancePrice: 23.45,
  },
  dualPrice: {
    smartPriceMemberPays: 30,
    pbmType: 'thirdParty',
    pbmMemberPays: 23.45,
  },
};
export const pbmPriceMock1: IDrugPriceNcpdp = {
  ncpdp: '4902234',
  price: { memberPays: 33.7, planPays: 303.3, pharmacyTotalPrice: 337.0 },
  dualPrice: {
    smartPriceMemberPays: 400,
    pbmType: 'phx',
    pbmMemberPays: 33.7,
    pbmPlanPays: 303.3,
  },
};
export const pbmPriceMock2: IDrugPriceNcpdp = {
  ncpdp: '4921575',
  price: { memberPays: 36, planPays: 304.0, pharmacyTotalPrice: 340.0 },
  dualPrice: {
    smartPriceMemberPays: 400,
    pbmType: 'phx',
    pbmMemberPays: 36,
    pbmPlanPays: 304,
  },
};
export const pbmPriceMock3: IDrugPriceNcpdp = {
  ncpdp: '3845798',
  price: { memberPays: 34, planPays: 304.0, pharmacyTotalPrice: 338.0 },
  dualPrice: {
    smartPriceMemberPays: undefined,
    pbmType: 'phx',
    pbmMemberPays: 34,
    pbmPlanPays: 304,
  },
};

export const pbmPriceMock4: IDrugPriceNcpdp = {
  ncpdp: '3815341',
  price: { memberPays: 35, planPays: 304.0, pharmacyTotalPrice: 339.0 },
  dualPrice: {
    smartPriceMemberPays: 400,
    pbmType: 'phx',
    pbmMemberPays: 35,
    pbmPlanPays: 304,
  },
};
