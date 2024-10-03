// Copyright 2018 Prescryptive Health, Inc.

export interface IPharmacyOffer {
  daysSupply?: number;
  hasDriveThru?: boolean;
  isBrand?: boolean;
  offerId: string;
  pharmacyNcpdp: string;
  price: {
    pharmacyCashPrice: number;
    planCoveragePays: number;
    memberPaysOffer: number;
    memberPaysShipping?: number;
    memberPaysTotal: number;
  };
  recommendation?: {
    identifier: string;
    index?: number;
  };
  sort: {
    distance?: number;
    price: number;
  };
  type: 'retail' | 'mail-order';
}
