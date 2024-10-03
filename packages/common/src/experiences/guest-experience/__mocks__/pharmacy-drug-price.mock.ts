// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../../models/pharmacy-drug-price';

export const pharmacyDrugPrice1Mock: IPharmacyDrugPrice = {
  pharmacy: {
    address: {
      lineOne: 'address-line-1-1',
      lineTwo: 'address-line-2-1',
      city: 'city-1',
      state: 'state-1',
      zip: 'zip-1',
      distance: 'distance-1',
    },
    name: 'name-1',
    ncpdp: 'ncpdp-1',
    phoneNumber: 'phone-1',
    twentyFourHours: false,
    hours: [
      {
        day: 'day-1-1',
        opens: {
          h: 11,
          m: 11,
          pm: false,
        },
      },
      {
        day: 'day-2-1',
        opens: {
          h: 21,
          m: 21,
          pm: true,
        },
      },
    ],
    isMailOrderOnly: false,
    inNetwork: true,
  },
  price: {
    memberPays: 1,
    planPays: 11,
    pharmacyTotalPrice: 111,
  },
  otherPharmacies: [
    {
      pharmacy: {
        address: {
          lineOne: 'other-address-line-1-1',
          lineTwo: 'other-address-line-2-1',
          city: 'other-city-1',
          state: 'other-state-1',
          zip: 'other-zip-1',
          distance: 'other-distance-1',
        },
        name: 'other-name-1',
        ncpdp: 'other-ncpdp-1',
        phoneNumber: 'other-phone-1',
        twentyFourHours: false,
        hours: [
          {
            day: 'day-1-1',
            opens: {
              h: 11,
              m: 11,
              pm: false,
            },
          },
          {
            day: 'day-2-1',
            opens: {
              h: 21,
              m: 21,
              pm: true,
            },
          },
        ],
        isMailOrderOnly: false,
        inNetwork: true,
      },
      price: {
        memberPays: 49,
        planPays: 51,
        pharmacyTotalPrice: 100,
        insurancePrice: 23.56,
      },
    },
  ],
};

export const pharmacyDrugPrice1UntrimmedMock: IPharmacyDrugPrice = {
  ...pharmacyDrugPrice1Mock,
  pharmacy: {
    ...pharmacyDrugPrice1Mock.pharmacy,
    name: `  ${pharmacyDrugPrice1Mock.pharmacy?.name}  `,
    address: {
      ...pharmacyDrugPrice1Mock.pharmacy.address,
      lineOne: ` ${pharmacyDrugPrice1Mock.pharmacy?.address.lineOne}  `,
      lineTwo: ` ${pharmacyDrugPrice1Mock.pharmacy?.address.lineTwo}  `,
      city: ` ${pharmacyDrugPrice1Mock.pharmacy?.address.city}  `,
      state: ` ${pharmacyDrugPrice1Mock.pharmacy?.address.state}  `,
      zip: ` ${pharmacyDrugPrice1Mock.pharmacy?.address.zip}  `,
    },
    phoneNumber: ` ${pharmacyDrugPrice1Mock.pharmacy?.phoneNumber}  `,
  },
};

export const pharmacyDrugPrice2Mock: IPharmacyDrugPrice = {
  pharmacy: {
    address: {
      lineOne: 'address-line-1-2',
      lineTwo: 'address-line-2-2',
      city: 'city-2',
      state: 'state-2',
      zip: 'zip-2',
      distance: 'distance-2',
    },
    name: 'name-2',
    ncpdp: 'ncpdp-2',
    phoneNumber: 'phone-2',
    twentyFourHours: true,
    hours: [
      {
        day: 'day-1-2',
        opens: {
          h: 12,
          m: 12,
          pm: false,
        },
      },
      {
        day: 'day-2-2',
        opens: {
          h: 22,
          m: 22,
          pm: true,
        },
      },
    ],
    isMailOrderOnly: false,
    inNetwork: true,
  },
  price: {
    memberPays: 2,
    planPays: 22,
    pharmacyTotalPrice: 222,
    insurancePrice: 23.56,
  },
  coupon: {
    productManufacturerName: 'Almatica Pharma',
    price: 1000,
    ageLimit: 65,
    introductionDialog: 'Pay as little as $28 with manufacturer coupon.',
    eligibilityURL:
      'https://www.gralise.com/pdfs/GRALISE_Digital_Copay_Card_Download.pdf',
    copayText: 'With coupon, pay as little as',
    copayAmount: 28,
    groupNumber: 'EC95001001',
    pcn: 'CN',
    memberId: '58685267102',
    bin: '004682',
    featuredPharmacy: '',
    logo: {
      name: 'Almatica Logo.bmp',
      alternativeText: '',
      caption: '',
      hash: 'Almatica_Logo_8b7fac3a55',
      ext: '.bmp',
      mime: 'image/bmp',
      size: 54.33,
      url: '/uploads/Almatica_Logo_8b7fac3a55.bmp',
      provider: 'local',
      width: 10,
      height: 20,
      id: '612d0e582b1cb1001be63c24',
    },
  },
};

export const pharmacyDrugPrice2UntrimmedMock: IPharmacyDrugPrice = {
  ...pharmacyDrugPrice2Mock,
  pharmacy: {
    ...pharmacyDrugPrice2Mock.pharmacy,
    name: `  ${pharmacyDrugPrice2Mock.pharmacy?.name}  `,
    address: {
      ...pharmacyDrugPrice2Mock.pharmacy.address,
      lineOne: ` ${pharmacyDrugPrice2Mock.pharmacy?.address.lineOne}  `,
      lineTwo: ` ${pharmacyDrugPrice2Mock.pharmacy?.address.lineTwo}  `,
      city: ` ${pharmacyDrugPrice2Mock.pharmacy?.address.city}  `,
      state: ` ${pharmacyDrugPrice2Mock.pharmacy?.address.state}  `,
      zip: ` ${pharmacyDrugPrice2Mock.pharmacy?.address.zip}  `,
    },
    phoneNumber: ` ${pharmacyDrugPrice2Mock.pharmacy?.phoneNumber}  `,
  },
};

export const pharmacyDrugPrice2OutOfNetworkMock: IPharmacyDrugPrice = {
  pharmacy: {
    address: {
      lineOne: 'address-line-1-3',
      lineTwo: 'address-line-2-3',
      city: 'city-3',
      state: 'state-3',
      zip: 'zip-3',
      distance: 'distance-3',
    },
    name: 'name-3',
    ncpdp: 'ncpdp-3',
    phoneNumber: 'phone-3',
    twentyFourHours: true,
    hours: [
      {
        day: 'day-1-2',
        opens: {
          h: 12,
          m: 12,
          pm: false,
        },
      },
      {
        day: 'day-2-2',
        opens: {
          h: 22,
          m: 22,
          pm: true,
        },
      },
    ],
    isMailOrderOnly: false,
    inNetwork: false,
  },
  price: undefined,
  coupon: {
    productManufacturerName: 'Almatica Pharma',
    price: 1000,
    ageLimit: 65,
    introductionDialog: 'Pay as little as $28 with manufacturer coupon.',
    eligibilityURL:
      'https://www.gralise.com/pdfs/GRALISE_Digital_Copay_Card_Download.pdf',
    copayText: 'With coupon, pay as little as',
    copayAmount: 28,
    groupNumber: 'EC95001001',
    pcn: 'CN',
    memberId: '58685267102',
    bin: '004682',
    featuredPharmacy: '',
    logo: {
      name: 'Almatica Logo.bmp',
      alternativeText: '',
      caption: '',
      hash: 'Almatica_Logo_8b7fac3a55',
      ext: '.bmp',
      mime: 'image/bmp',
      size: 54.33,
      url: '/uploads/Almatica_Logo_8b7fac3a55.bmp',
      provider: 'local',
      width: 10,
      height: 20,
      id: '612d0e582b1cb1001be63c24',
    },
  },
};
