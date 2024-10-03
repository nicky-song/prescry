// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { IPharmacyDrugPrice } from '@phx/common/src/models/pharmacy-drug-price';
import { pharmacyDrugPriceGrouper } from './pharmacy-drug-price.grouper';

const pharmacyDrugPriceMock1a: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock1a',
    brand: 'brand-1',
    chainId: 1,
  } as IPharmacy,
  price: { memberPays: 1, planPays: 1 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock1b: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock1b',
    brand: 'brand-1',
    chainId: 1,
  } as IPharmacy,
  price: { memberPays: 1, planPays: 1 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock1c: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock1c',
    brand: 'brand-1',
    chainId: 1,
  } as IPharmacy,
  price: { memberPays: 1, planPays: 1 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock1d: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock1d',
    brand: 'brand-1',
    chainId: 1,
  } as IPharmacy,
  price: { memberPays: 1, planPays: 1 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock2a: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock2a',
    brand: 'brand-2',
    chainId: 2,
  } as IPharmacy,
  price: { memberPays: 2, planPays: 2 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock2b: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock1b',
    brand: 'brand-2',
    chainId: 2,
  } as IPharmacy,
  price: { memberPays: 2, planPays: 2 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock2c: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock2c',
    brand: 'brand-2',
    chainId: 2,
  } as IPharmacy,
  price: { memberPays: 2, planPays: 2 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock3a: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock3a',
    brand: 'brand-3',
    chainId: 3,
  } as IPharmacy,
  price: { memberPays: 3, planPays: 3 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock3b: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock1b',
    brand: 'brand-3',
    chainId: 3,
  } as IPharmacy,
  price: { memberPays: 3, planPays: 3 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceMock4a: IPharmacyDrugPrice = {
  pharmacy: {
    name: 'pharmacyDrugPriceMock4a',
    brand: 'brand-4',
    chainId: 4,
  } as IPharmacy,
  price: { memberPays: 4, planPays: 4 },
} as IPharmacyDrugPrice;

const pharmacyDrugPriceGroupMock1: IPharmacyDrugPrice = {
  ...pharmacyDrugPriceMock1a,
  otherPharmacies: [
    pharmacyDrugPriceMock1b,
    pharmacyDrugPriceMock1c,
    pharmacyDrugPriceMock1d,
  ],
};

const pharmacyDrugPriceGroupMock2: IPharmacyDrugPrice = {
  ...pharmacyDrugPriceMock2a,
  otherPharmacies: [pharmacyDrugPriceMock2b, pharmacyDrugPriceMock2c],
};

const pharmacyDrugPriceGroupMock3: IPharmacyDrugPrice = {
  ...pharmacyDrugPriceMock3a,
  otherPharmacies: [pharmacyDrugPriceMock3b],
};

const pharmacyDrugPriceGroupMock4: IPharmacyDrugPrice = {
  ...pharmacyDrugPriceMock4a,
};

describe('pharmacyDrugPriceGrouper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns expected IPharmacyDrugPrice array grouped by brand, chainId, memberPays, and planPays', () => {
    const pharmacyDrugPriceListMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPriceMock1a,
      pharmacyDrugPriceMock1b,
      pharmacyDrugPriceMock1c,
      pharmacyDrugPriceMock1d,
      pharmacyDrugPriceMock2a,
      pharmacyDrugPriceMock2b,
      pharmacyDrugPriceMock2c,
      pharmacyDrugPriceMock3a,
      pharmacyDrugPriceMock3b,
      pharmacyDrugPriceMock4a,
    ];

    const expectedPharmacyDrugPriceGroup: IPharmacyDrugPrice[] = [
      pharmacyDrugPriceGroupMock1,
      pharmacyDrugPriceGroupMock2,
      pharmacyDrugPriceGroupMock3,
      pharmacyDrugPriceGroupMock4,
    ];

    expect(pharmacyDrugPriceGrouper(pharmacyDrugPriceListMock)).toEqual(
      expectedPharmacyDrugPriceGroup
    );
  });

  it.each([
    ['not ', undefined, 1, 1, 1],
    ['not ', 'brand', undefined, 1, 1],
    ['not ', 'brand', 1, undefined, 1],
    ['not ', 'brand', 1, 1, undefined],
    ['', 'brand', 1, 1, 1],
    ['', 'brand', 1, 0, 0],
  ])(
    'does %sgroup instances of pharmacyDrugPrice if (brand: %s, chainId: %s, memberPays: %s, planPays: %s)',
    (
      _not: string,
      brand?: string,
      chainId?: number,
      memberPays?: number,
      planPays?: number
    ) => {
      const pharmacyDrugPriceMock: IPharmacyDrugPrice = {
        pharmacy: {
          name: 'jacksons-pharmacy',
          brand,
          chainId,
        } as IPharmacy,
        price: { memberPays, planPays },
      } as IPharmacyDrugPrice;

      const pharmacyDrugPriceMockPro: IPharmacyDrugPrice = {
        pharmacy: {
          name: 'jacksons-pharmacy-pro',
          brand,
          chainId,
        } as IPharmacy,
        price: { memberPays, planPays },
      } as IPharmacyDrugPrice;

      const originalPharmacyDrugPriceList = [
        pharmacyDrugPriceMock,
        pharmacyDrugPriceMockPro,
      ];

      const pharmacyDrugPriceGroup = pharmacyDrugPriceGrouper(
        originalPharmacyDrugPriceList
      );

      if (
        brand === undefined ||
        chainId === undefined ||
        memberPays === undefined ||
        planPays === undefined
      ) {
        expect(pharmacyDrugPriceGroup).toEqual([
          pharmacyDrugPriceMock,
          pharmacyDrugPriceMockPro,
        ]);
      } else {
        expect(pharmacyDrugPriceGroup).toEqual([
          {
            ...pharmacyDrugPriceMock,
            otherPharmacies: [pharmacyDrugPriceMockPro],
          },
        ]);
      }
    }
  );
});
