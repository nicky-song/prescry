// Copyright 2022 Prescryptive Health, Inc.

import { IDrugPrice, IDualDrugPrice } from '@phx/common/src/models/drug-price';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { ICoupon, ICouponProvider } from '../models/coupon';
import { IDrugPriceNcpdp } from '../models/drug-price-ncpdp';
import { couponMock } from './coupon.mock';

export const featuredPharmacyMock1: IPharmacy = {
  ncpdp: '1',
  name: 'featuredPharmacyDrugPriceMock1',
  brand: 'brand-1',
  chainId: 1,
} as IPharmacy;

export const featuredCouponMock1: ICoupon = {
  ...couponMock,
  FeaturedCouponProvider: {
    ...couponMock.FeaturedCouponProvider,
    NCPDP: '1',
  } as ICouponProvider,
};

export const somePharmacyMock1: IPharmacy = {
  ncpdp: 'some-1',
  name: 'somePharmacyDrugPriceMock1',
  brand: 'some-brand-1',
  chainId: -1,
} as IPharmacy;

export const someDrugPriceMock1 = undefined;

export const featuredCouponMock2: ICoupon = {
  ...couponMock,
  FeaturedCouponProvider: {
    ...couponMock.FeaturedCouponProvider,
    NCPDP: '2',
  } as ICouponProvider,
  CouponProviders: [],
};

export const featuredPharmacyMock2: IPharmacy = {
  ncpdp: '2',
  name: 'featuredPharmacyDrugPriceMock2',
  brand: 'brand-2',
  chainId: 2,
} as IPharmacy;

export const featuredDrugPriceMock2 = undefined;

export const somePharmacyMock2: IPharmacy = {
  ncpdp: 'some-2',
  name: 'somePharmacyDrugPriceMock3',
  brand: 'brand-2',
  chainId: 2,
} as IPharmacy;

export const someDrugPriceMock2 = undefined;

export const featuredCouponMock3: ICoupon = {
  ...couponMock,
  FeaturedCouponProvider: {
    ...couponMock.FeaturedCouponProvider,
    NCPDP: '3',
  } as ICouponProvider,
};

export const featuredPharmacyMock3: IPharmacy = {
  ncpdp: '3',
  name: 'featuredPharmacyDrugPriceMock3',
  brand: 'brand-3',
  chainId: 3,
} as IPharmacy;

export const featuredDrugPriceMock3: IDrugPrice = {
  memberPays: 3,
  planPays: 3,
  pharmacyTotalPrice: 6,
};

export const featuredDualDrugPriceMock3: IDualDrugPrice = {
  smartPriceMemberPays: 10,
  pbmType: 'phx',
  pbmMemberPays: 3,
  pbmPlanPays: 3,
};

export const featuredDrugPriceNcpdpMock3: IDrugPriceNcpdp = {
  ncpdp: '3',
  price: featuredDrugPriceMock3,
  dualPrice: featuredDualDrugPriceMock3,
} as IDrugPriceNcpdp;

export const somePharmacyMock3: IPharmacy = {
  ncpdp: 'some-3',
  name: 'somePharmacyDrugPriceMock',
  brand: 'brand-3',
  chainId: 3,
} as IPharmacy;

export const someDrugPriceMock3: IDrugPrice = {
  memberPays: 3,
  planPays: 3,
  pharmacyTotalPrice: 6,
};

export const someDualDrugPriceMock3: IDualDrugPrice = {
  smartPriceMemberPays: 10,
  pbmType: 'phx',
  pbmMemberPays: 3,
  pbmPlanPays: 3,
};

export const somePharmacyDrugPriceNcpdpMock3: IDrugPriceNcpdp = {
  ncpdp: 'some-3',
  price: someDrugPriceMock3,
  dualPrice: someDualDrugPriceMock3,
} as IDrugPriceNcpdp;

export const featuredCouponMock4: ICoupon = {
  ...couponMock,
  FeaturedCouponProvider: {
    ...couponMock.FeaturedCouponProvider,
    NCPDP: '4',
  } as ICouponProvider,
};

export const featuredPharmacyMock4: IPharmacy = {
  ncpdp: '4',
  name: 'featuredPharmacyDrugPriceMock4',
  brand: 'brand-4',
  chainId: 4,
} as IPharmacy;

export const featuredDrugPriceMock4: IDrugPrice = {
  memberPays: 4,
  planPays: 4,
  pharmacyTotalPrice: 8,
};

export const featuredDualDrugPriceMock4: IDualDrugPrice = {
  smartPriceMemberPays: 10,
  pbmType: 'phx',
  pbmMemberPays: 4,
  pbmPlanPays: 4,
};

export const featuredDrugPriceNcpdpMock4: IDrugPriceNcpdp = {
  ncpdp: '4',
  price: featuredDrugPriceMock4,
  dualPrice: featuredDualDrugPriceMock4,
};

export const somePharmacyMock4a: IPharmacy = {
  ncpdp: 'some-4a',
  name: 'somePharmacyDrugPriceMock4a',
  brand: 'brand-4',
  chainId: 4,
} as IPharmacy;

export const someDrugPriceMock4a: IDrugPrice = {
  memberPays: 44,
  planPays: 44,
  pharmacyTotalPrice: 88,
};

export const someDualDrugPriceMock4a: IDualDrugPrice = {
  smartPriceMemberPays: 100,
  pbmType: 'phx',
  pbmMemberPays: 44,
  pbmPlanPays: 44,
};

export const someDrugPriceNcpdpMock4a: IDrugPriceNcpdp = {
  ncpdp: 'some-4a',
  price: someDrugPriceMock4a,
  dualPrice: someDualDrugPriceMock4a,
};

export const somePharmacyMock4b: IPharmacy = {
  ncpdp: 'some-4b',
  name: 'somePharmacyDrugPriceMock4b',
  brand: 'brand-4',
  chainId: 4,
} as IPharmacy;

export const someDrugPriceMock4b = undefined;

export const somePharmacyMock4c: IPharmacy = {
  ncpdp: 'some-4c',
  name: 'somePharmacyDrugPriceMock4c',
  brand: 'brand-4',
  chainId: 4,
} as IPharmacy;

export const someDrugPriceMock4c: IDrugPrice = {
  memberPays: 4,
  planPays: 4,
  pharmacyTotalPrice: 8,
};

export const someDualDrugPriceMock4c: IDualDrugPrice = {
  smartPriceMemberPays: 10,
  pbmType: 'phx',
  pbmMemberPays: 4,
  pbmPlanPays: 4,
};

export const someDrugPriceNcpdpMock4c: IDrugPriceNcpdp = {
  ncpdp: 'some-4c',
  price: someDrugPriceMock4c,
  dualPrice: someDualDrugPriceMock4c,
};

export const somePharmacyMock5a: IPharmacy = {
  ncpdp: 'some-5a',
  name: 'somePharmacyMock5a',
  brand: 'some-brand-5',
  chainId: 5,
} as IPharmacy;

export const someDrugPriceMock5a: IDrugPrice = {
  memberPays: 5,
  planPays: 5,
  pharmacyTotalPrice: 10,
};

export const someDualDrugPriceMock5a: IDualDrugPrice = {
  smartPriceMemberPays: 20,
  pbmType: 'phx',
  pbmMemberPays: 5,
  pbmPlanPays: 5,
};

export const someDrugPriceNcpdpMock5a: IDrugPriceNcpdp = {
  ncpdp: 'some-5a',
  price: someDrugPriceMock5a,
  dualPrice: someDualDrugPriceMock5a,
};

export const somePharmacyMock5b: IPharmacy = {
  ncpdp: 'some-5b',
  name: 'somePharmacyMock5b',
  brand: 'some-brand-5',
  chainId: 5,
  distance: 1,
} as IPharmacy;

export const someDrugPriceMock5b: IDrugPrice = {
  memberPays: 5,
  planPays: 5,
  pharmacyTotalPrice: 10,
};

export const someDualDrugPriceMock5b: IDualDrugPrice = {
  smartPriceMemberPays: 20,
  pbmType: 'phx',
  pbmMemberPays: 5,
  pbmPlanPays: 5,
};

export const someDrugPriceNcpdpMock5b: IDrugPriceNcpdp = {
  ncpdp: 'some-5b',
  price: someDrugPriceMock5b,
  dualPrice: someDualDrugPriceMock5b,
};

export const somePharmacyMock5c: IPharmacy = {
  ncpdp: 'some-5c',
  name: 'somePharmacyMock5c',
  brand: 'some-brand-5',
  chainId: 5,
  distance: 2,
} as IPharmacy;

export const someDrugPriceMock5c: IDrugPrice = {
  memberPays: 5,
  planPays: 5,
  pharmacyTotalPrice: 10,
};

export const someDualDrugPriceMock5c: IDualDrugPrice = {
  smartPriceMemberPays: 20,
  pbmType: 'phx',
  pbmMemberPays: 5,
  pbmPlanPays: 5,
};

export const someDrugPriceNcpdpMock5c: IDrugPriceNcpdp = {
  ncpdp: 'some-5c',
  price: someDrugPriceMock5c,
  dualPrice: someDualDrugPriceMock5c,
};

export const somePharmacyMock5d: IPharmacy = {
  ncpdp: 'some-5d',
  name: 'somePharmacyMock5d',
  brand: 'some-other-brand',
  chainId: -5,
} as IPharmacy;

export const someDrugPriceMock5d: IDrugPrice = {
  memberPays: 55,
  planPays: 55,
  pharmacyTotalPrice: 110,
};

export const someDualDrugPriceMock5d: IDualDrugPrice = {
  smartPriceMemberPays: 200,
  pbmType: 'phx',
  pbmMemberPays: 55,
  pbmPlanPays: 55,
};

export const someDrugPriceNcpdpMock5d: IDrugPriceNcpdp = {
  ncpdp: 'some-5d',
  price: someDrugPriceMock5d,
  dualPrice: someDualDrugPriceMock5d,
};
