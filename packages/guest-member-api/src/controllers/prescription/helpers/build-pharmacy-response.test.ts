// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyDrugPriceResponse } from '@phx/common/src/models/api-response/pharmacy-price-search.response';
import {
  buildPharmacyResponse,
  isPharmacyFeatured,
  isPharmacyInCouponNetwork,
} from './build-pharmacy-response';
import { ICouponProvider } from '../../../models/coupon';
import {
  couponMock,
  matchingCouponMock,
  unmatchingCouponMock,
} from '../../../mock-data/coupon.mock';
import {
  couponPharmacyMock,
  pharmacyMock1,
  pharmacyMock2,
  pharmacyMock3,
  pharmacyMock4,
} from '../../../mock-data/pharmacy.mock';
import {
  smartPriceMock1,
  smartPriceMock2,
  smartPriceMock3,
  pbmPriceMock1,
  pbmPriceMock2,
  pbmPriceMock3,
  pbmPriceMock4,
  featuredPharmacyPriceMock,
  smartPriceMock4,
} from '../../../mock-data/drug-price-ncpdp.mock';
import { IDrugPriceNcpdp } from '../../../models/drug-price-ncpdp';
import {
  ICouponDetails,
  ICouponDetailsLogo,
} from '@phx/common/src/models/coupon-details/coupon-details';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import {
  featuredPharmacyMock1,
  somePharmacyMock1,
  featuredCouponMock1,
  featuredPharmacyMock2,
  somePharmacyMock2,
  featuredCouponMock2,
  featuredPharmacyMock3,
  featuredCouponMock3,
  somePharmacyMock3,
  featuredDrugPriceNcpdpMock3,
  somePharmacyDrugPriceNcpdpMock3,
  someDrugPriceMock3,
  featuredDrugPriceMock3,
  featuredCouponMock4,
  featuredPharmacyMock4,
  featuredDrugPriceMock4,
  somePharmacyMock4a,
  somePharmacyMock4b,
  featuredDrugPriceNcpdpMock4,
  someDrugPriceNcpdpMock4a,
  somePharmacyMock4c,
  someDrugPriceMock4c,
  someDrugPriceNcpdpMock4c,
  someDrugPriceMock4a,
  somePharmacyMock5a,
  somePharmacyMock5b,
  somePharmacyMock5c,
  somePharmacyMock5d,
  someDrugPriceNcpdpMock5a,
  someDrugPriceNcpdpMock5b,
  someDrugPriceNcpdpMock5c,
  someDrugPriceNcpdpMock5d,
  someDrugPriceMock5b,
  someDrugPriceMock5c,
  someDrugPriceMock5d,
  someDrugPriceMock5a,
  someDualDrugPriceMock3,
  someDualDrugPriceMock4a,
  someDualDrugPriceMock4c,
  someDualDrugPriceMock5a,
  someDualDrugPriceMock5b,
  someDualDrugPriceMock5c,
  someDualDrugPriceMock5d,
  featuredDualDrugPriceMock3,
  featuredDualDrugPriceMock4,
} from '../../../mock-data/featured-pharmacies.mock';
import { IPharmacyDrugPrice } from '@phx/common/src/models/pharmacy-drug-price';
import { mapCouponToCouponDetails } from './map-coupon-to-coupon-details';

describe('buildPharmacyResponse', () => {
  const sortByPriceMock = 'youpay';
  const sortByPlanPayMock = 'planpays';
  const sortByDistanceMock = 'distance';
  const limitMock = 20;

  const pharmaciesWithFeaturedMock1: IPharmacy[] = [
    featuredPharmacyMock1,
    somePharmacyMock1,
  ];

  const pharmaciesWithFeaturedMock2: IPharmacy[] = [
    featuredPharmacyMock2,
    somePharmacyMock2,
  ];

  const pharmaciesWithFeaturedMock3: IPharmacy[] = [
    featuredPharmacyMock3,
    somePharmacyMock3,
  ];

  const pharmaciesWithFeaturedMock4: IPharmacy[] = [
    featuredPharmacyMock4,
    somePharmacyMock4a,
    somePharmacyMock4b,
    somePharmacyMock4c,
  ];

  const drugPriceNcpdpWithFeaturedMock1: IDrugPriceNcpdp[] = [];

  const drugPriceNcpdpWithFeaturedMock2: IDrugPriceNcpdp[] = [];

  const drugPriceNcpdpWithFeaturedMock3: IDrugPriceNcpdp[] = [
    featuredDrugPriceNcpdpMock3,
    somePharmacyDrugPriceNcpdpMock3,
  ];

  const drugPriceNcpdpWithFeaturedMock4: IDrugPriceNcpdp[] = [
    featuredDrugPriceNcpdpMock4,
    someDrugPriceNcpdpMock4a,
    someDrugPriceNcpdpMock4c,
  ];

  const mockPharmacyLookupResponse: IPharmacy[] = [
    pharmacyMock1,
    pharmacyMock2,
    pharmacyMock3,
  ];

  const mockPharmacyLookupResponseWithFeatured: IPharmacy[] = [
    pharmacyMock1,
    pharmacyMock2,
    couponPharmacyMock,
    pharmacyMock3,
  ];
  const mockPbmPrices: IDrugPriceNcpdp[] = [
    pbmPriceMock1,
    pbmPriceMock2,
    pbmPriceMock3,
  ];
  const mockSmartPrices: IDrugPriceNcpdp[] = [
    smartPriceMock1,
    smartPriceMock2,
    smartPriceMock3,
  ];
  const mockSmartPricesWithFeatured: IDrugPriceNcpdp[] = [
    smartPriceMock1,
    smartPriceMock2,
    smartPriceMock3,
    featuredPharmacyPriceMock,
  ];

  const mockPharmacyLookupResponseForSorting: IPharmacy[] = [
    pharmacyMock3,
    pharmacyMock1,
    pharmacyMock2,
    pharmacyMock4,
  ];
  const mockPbmPricesForSorting: IDrugPriceNcpdp[] = [
    pbmPriceMock3,
    pbmPriceMock1,
    pbmPriceMock2,
    pbmPriceMock4,
  ];

  const couponInfoMatchingNcpdpMock = {
    ageLimit: 65,
    bin: '004682',
    copayAmount: 20,
    copayText: 'Copay Text Value',
    eligibilityURL: 'www.myeligibilityurl.com',
    featuredPharmacy: '0000002',
    groupNumber: 'EC95001001',
    introductionDialog: 'Pay as little as $28 with manufacturer coupon',
    logo: {} as ICouponDetailsLogo,
    memberId: '58685267102',
    pcn: 'CN',
    price: 50,
    productManufacturerName: 'Zephyr Pharmaceuticals',
  };

  const couponInfoMock = {
    ageLimit: 65,
    bin: '004682',
    copayAmount: 28,
    copayText: 'With coupon, pay as little as',
    eligibilityURL:
      'https://www.gralise.com/pdfs/GRALISE_Digital_Copay_Card_Download.pdf',
    featuredPharmacy: '0000002',
    groupNumber: 'EC95001001',
    introductionDialog: 'Pay as little as $28 with manufacturer coupon.',
    logo: {
      alternativeText: '',
      caption: '',
      ext: '.bmp',
      hash: 'Almatica_Logo_8b7fac3a55',
      height: 20,
      id: '612d0e582b1cb1001be63c24',
      mime: 'image/bmp',
      name: 'Almatica Logo.bmp',
      provider: 'local',
      size: 54.33,
      url: '/uploads/Almatica_Logo_8b7fac3a55.bmp',
      width: 10,
    },
    memberId: '58685267102',
    pcn: 'CN',
    price: 1000,
    productManufacturerName: 'Almatica Pharma',
  };
  it('should build empty pharmacy response from the pharmacy lookup response when no price exists', () => {
    const mockSearchPharmacyResponse: IPharmacyDrugPriceResponse = {
      pharmacyPrices: [],
    };

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitMock,
        []
      )
    ).toEqual(mockSearchPharmacyResponse);
  });

  it('should only return pharmacies that have matching ncpdp with coupon', () => {
    const expectedPharmacyResponseWithFeaturedAndOtherPharmacy = {
      bestPricePharmacy: {
        coupon: couponInfoMatchingNcpdpMock,
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        price: smartPriceMock1.price,
        dualPrice: smartPriceMock1.dualPrice,
      },
      pharmacyPrices: [],
    };

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponseWithFeatured,
        sortByPriceMock,
        limitMock,
        mockSmartPricesWithFeatured,
        matchingCouponMock,
        false
      )
    ).toEqual(expectedPharmacyResponseWithFeaturedAndOtherPharmacy);
    const expectedPharmacyResponseWithFeatured = {
      bestPricePharmacy: undefined,
      pharmacyPrices: [],
    };
    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponseWithFeatured,
        sortByPriceMock,
        limitMock,
        [smartPriceMock3, featuredPharmacyPriceMock],
        matchingCouponMock,
        false
      )
    ).toEqual(expectedPharmacyResponseWithFeatured);

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitMock,
        mockSmartPrices,
        unmatchingCouponMock
      )
    ).toEqual({
      bestPricePharmacy: undefined,
      pharmacyPrices: [],
    });
  });

  it('should add featured pharmacy for coupon as best price pharmacy even if it does not have price', () => {
    const expectedPharmacySmartPriceResponse = {
      bestPricePharmacy: {
        coupon: couponInfoMatchingNcpdpMock,
        pharmacy: pharmacyMock1,
        price: smartPriceMock1.price,
        dualPrice: smartPriceMock1.dualPrice,
      },
      pharmacyPrices: [],
    };
    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponseWithFeatured,
        sortByPriceMock,
        limitMock,
        mockSmartPrices,
        matchingCouponMock,
        false
      )
    ).toEqual(expectedPharmacySmartPriceResponse);
  });

  it('should build pharmacy response from the pharmacy lookup response with sorted prices', () => {
    const mockSearchPharmacyResponse: IPharmacyDrugPriceResponse = {
      bestPricePharmacy: {
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [
        {
          pharmacy: { ...pharmacyMock3, inNetwork: true },
          price: pbmPriceMock3.price,
          dualPrice: pbmPriceMock3.dualPrice,
        },
        {
          pharmacy: { ...pharmacyMock2, inNetwork: true },
          price: pbmPriceMock2.price,
          dualPrice: pbmPriceMock2.dualPrice,
        },
      ],
    };

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitMock,
        mockPbmPrices
      )
    ).toEqual(mockSearchPharmacyResponse);

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitMock,
        mockPbmPrices,
        couponMock
      )
    ).toEqual({
      bestPricePharmacy: {
        coupon: couponInfoMock,
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [
        {
          coupon: couponInfoMock,
          pharmacy: { ...pharmacyMock3, inNetwork: true },
          price: pbmPriceMock3.price,
          dualPrice: pbmPriceMock3.dualPrice,
        },
        {
          coupon: couponInfoMock,
          pharmacy: { ...pharmacyMock2, inNetwork: true },
          price: pbmPriceMock2.price,
          dualPrice: pbmPriceMock2.dualPrice,
        },
      ],
    });
  });

  it('should build pharmacy response from the pharmacy lookup response with sorted dualPrices if useDualPrice flag is set', () => {
    const useDualPriceMock = true;

    const mockSearchPharmacyResponse: IPharmacyDrugPriceResponse = {
      bestPricePharmacy: {
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [
        {
          pharmacy: { ...pharmacyMock3, inNetwork: true },
          price: pbmPriceMock3.price,
          dualPrice: pbmPriceMock3.dualPrice,
        },
        {
          pharmacy: { ...pharmacyMock2, inNetwork: true },
          price: pbmPriceMock2.price,
          dualPrice: pbmPriceMock2.dualPrice,
        },
      ],
    };

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitMock,
        mockPbmPrices,
        undefined,
        undefined,
        useDualPriceMock
      )
    ).toEqual(mockSearchPharmacyResponse);

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitMock,
        mockPbmPrices,
        couponMock,
        undefined,
        useDualPriceMock
      )
    ).toEqual({
      bestPricePharmacy: {
        coupon: couponInfoMock,
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [
        {
          coupon: couponInfoMock,
          pharmacy: { ...pharmacyMock3, inNetwork: true },
          price: pbmPriceMock3.price,
          dualPrice: pbmPriceMock3.dualPrice,
        },
        {
          coupon: couponInfoMock,
          pharmacy: { ...pharmacyMock2, inNetwork: true },
          price: pbmPriceMock2.price,
          dualPrice: pbmPriceMock2.dualPrice,
        },
      ],
    });
  });

  it('should build pharmacy response from the pharmacy lookup response with specified limit of response', () => {
    const limitTwo = 2;

    const mockSearchPharmacyResponse: IPharmacyDrugPriceResponse = {
      bestPricePharmacy: {
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [
        {
          pharmacy: { ...pharmacyMock3, inNetwork: true },
          price: pbmPriceMock3.price,
          dualPrice: pbmPriceMock3.dualPrice,
        },
      ],
    };
    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitTwo,
        mockPbmPrices,
        undefined,
        false
      )
    ).toEqual(mockSearchPharmacyResponse);
    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitTwo,
        mockPbmPrices,
        couponMock,
        false
      )
    ).toEqual({
      bestPricePharmacy: {
        coupon: couponInfoMock,
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [
        {
          coupon: couponInfoMock,
          pharmacy: { ...pharmacyMock3, inNetwork: true },
          price: pbmPriceMock3.price,
          dualPrice: pbmPriceMock3.dualPrice,
        },
      ],
    });
  });

  it('should build pharmacy response from the pharmacy lookup response with sorted plan pays prices', () => {
    const mockSearchPharmacyResponse: IPharmacyDrugPriceResponse = {
      bestPricePharmacy: {
        pharmacy: pharmacyMock1,
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [
        {
          pharmacy: { ...pharmacyMock3, inNetwork: true },
          price: pbmPriceMock3.price,
          dualPrice: pbmPriceMock3.dualPrice,
        },

        {
          pharmacy: { ...pharmacyMock4, inNetwork: true },
          price: pbmPriceMock4.price,
          dualPrice: pbmPriceMock4.dualPrice,
        },
        {
          pharmacy: { ...pharmacyMock2, inNetwork: true },
          price: pbmPriceMock2.price,
          dualPrice: pbmPriceMock2.dualPrice,
        },
      ],
    };
    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponseForSorting,
        sortByPlanPayMock,
        limitMock,
        mockPbmPricesForSorting,
        undefined,
        false
      )
    ).toEqual(mockSearchPharmacyResponse);
  });

  it('should build pharmacy response from the pharmacy lookup response with sorted distance', () => {
    const mockSearchPharmacyResponse: IPharmacyDrugPriceResponse = {
      bestPricePharmacy: {
        coupon: undefined,
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [
        {
          coupon: undefined,
          pharmacy: { ...pharmacyMock3, inNetwork: true },
          price: pbmPriceMock3.price,
          dualPrice: pbmPriceMock3.dualPrice,
        },
        {
          pharmacy: { ...pharmacyMock4, inNetwork: true },
          price: pbmPriceMock4.price,
          dualPrice: pbmPriceMock4.dualPrice,
        },
        {
          coupon: undefined,
          pharmacy: { ...pharmacyMock2, inNetwork: true },
          price: pbmPriceMock2.price,
          dualPrice: pbmPriceMock2.dualPrice,
        },
      ],
    };

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponseForSorting,
        sortByDistanceMock,
        limitMock,
        mockPbmPricesForSorting
      )
    ).toEqual(mockSearchPharmacyResponse);
  });

  it('should return regular bestPricePharmacy if not Featured Coupon Provider in pharmacy list', () => {
    const mockSearchPharmacyResponse: IPharmacyDrugPriceResponse = {
      bestPricePharmacy: {
        pharmacy: { ...pharmacyMock1, inNetwork: true },
        coupon: couponInfoMatchingNcpdpMock,
        price: pbmPriceMock1.price,
        dualPrice: pbmPriceMock1.dualPrice,
      },
      pharmacyPrices: [],
    };

    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponse,
        sortByPriceMock,
        limitMock,
        mockPbmPrices,
        matchingCouponMock,
        false
      )
    ).toEqual(mockSearchPharmacyResponse);
  });

  it('should return featured pharmacy as bestPricePharmacy if in pharmacy list', () => {
    const couponWithFeaturedMock = { ...matchingCouponMock };
    (couponWithFeaturedMock.FeaturedCouponProvider as ICouponProvider).NCPDP =
      '3815341';
    const mockSearchPharmacyResponse: IPharmacyDrugPriceResponse = {
      bestPricePharmacy: {
        coupon: {
          ageLimit: couponWithFeaturedMock?.AgeLimit || 0,
          bin: couponWithFeaturedMock?.BIN || '',
          copayAmount: couponWithFeaturedMock?.CopayAmount || 0,
          copayText: couponWithFeaturedMock?.CopayText || '',
          eligibilityURL: couponWithFeaturedMock?.EligibilityURL || '',
          featuredPharmacy:
            couponWithFeaturedMock.FeaturedCouponProvider?.NCPDP || '',
          groupNumber: couponWithFeaturedMock?.GroupNumber || '',
          introductionDialog: couponWithFeaturedMock?.IntroductionDialog || '',
          logo: couponWithFeaturedMock?.Logo || ({} as ICouponDetailsLogo),
          memberId: couponWithFeaturedMock?.MemberId || '',
          pcn: couponWithFeaturedMock?.PCN || '',
          price: couponWithFeaturedMock?.MaxPrice || 0,
          productManufacturerName:
            couponWithFeaturedMock?.ProductManufacturerName || '',
        },
        pharmacy: {
          ...pharmacyMock4,
          nationalProviderIdentifier: '1053486795',
          isMailOrderOnly: true,
        },
        price: smartPriceMock4.price,
        dualPrice: smartPriceMock4.dualPrice,
      },
      pharmacyPrices: [
        {
          pharmacy: pharmacyMock1,
          price: smartPriceMock1.price,
          dualPrice: smartPriceMock1.dualPrice,
          coupon: {
            ageLimit: couponWithFeaturedMock?.AgeLimit || 0,
            bin: couponWithFeaturedMock?.BIN || '',
            copayAmount: couponWithFeaturedMock?.CopayAmount || 0,
            copayText: couponWithFeaturedMock?.CopayText || '',
            eligibilityURL: couponWithFeaturedMock?.EligibilityURL || '',
            featuredPharmacy:
              couponWithFeaturedMock.FeaturedCouponProvider?.NCPDP || '',
            groupNumber: couponWithFeaturedMock?.GroupNumber || '',
            introductionDialog:
              couponWithFeaturedMock?.IntroductionDialog || '',
            logo: couponWithFeaturedMock?.Logo || ({} as ICouponDetailsLogo),
            memberId: couponWithFeaturedMock?.MemberId || '',
            pcn: couponWithFeaturedMock?.PCN || '',
            price: couponWithFeaturedMock?.MaxPrice || 0,
            productManufacturerName:
              couponWithFeaturedMock?.ProductManufacturerName || '',
          },
        },
      ],
    };

    const mailOrderPharmacyMock: IPharmacy = {
      ...pharmacyMock4,
      isMailOrderOnly: true,
      nationalProviderIdentifier: '1053486795',
    };

    const mockPharmacyLookupResponseWithMailOrder = [
      ...mockPharmacyLookupResponse,
      mailOrderPharmacyMock,
    ];
    expect(
      buildPharmacyResponse(
        mockPharmacyLookupResponseWithMailOrder,
        sortByPlanPayMock,
        limitMock,
        [smartPriceMock1, smartPriceMock2, smartPriceMock3, smartPriceMock4],
        couponWithFeaturedMock,
        false
      )
    ).toEqual(mockSearchPharmacyResponse);
  });

  it('isPharmacyFeatured helper function should return true if matching NCPDP value is featured', () => {
    // Arrange
    const featuredNCPDP = '0000002';

    // Act
    const result = isPharmacyFeatured(featuredNCPDP, unmatchingCouponMock);

    // Assert
    expect(result).toBe(true);
  });

  it('isPharmacyFeatured helper function should return false if matching NCPDP is not featured', () => {
    // Arrange
    const featuredNCPDP = '0000012';

    // Act
    const result = isPharmacyFeatured(featuredNCPDP, unmatchingCouponMock);

    // Assert
    expect(result).toBe(false);
  });

  it('isPharmacyInCouponNetwork helper function should return true if searched NCPDP is in-network and there is at least one coupon provider', () => {
    // Arrange
    const ncpdpInNetwork = '4902234';

    // Act
    const result = isPharmacyInCouponNetwork(
      ncpdpInNetwork,
      matchingCouponMock
    );

    // Assert
    expect(result).toBe(true);
  });

  it('isPharmacyInCouponNetwork helper function should return true if searched NCPDP is not in-network and there are no coupon providers', () => {
    // Arrange
    const ncpdpNotInNetwork = '4902235';

    // Act
    const result = isPharmacyInCouponNetwork(ncpdpNotInNetwork, couponMock);

    // Assert
    expect(result).toBe(true);
  });

  it('isPharmacyInCouponNetwork helper function should return false if searched NCPDP is not in-network and there is at least one coupon providers', () => {
    // Arrange
    const ncpdpNotInNetwork = '4902235';

    // Act
    const result = isPharmacyInCouponNetwork(
      ncpdpNotInNetwork,
      matchingCouponMock
    );

    // Assert
    expect(result).toBe(false);
  });

  it('sets featured pharmacy when there is only 1 pharmacy and no price', () => {
    const expectedCoupon: ICouponDetails =
      mapCouponToCouponDetails(featuredCouponMock1);

    const expectedSomePharmacyDrugPrice1: IPharmacyDrugPrice = {
      coupon: expectedCoupon,
      pharmacy: somePharmacyMock1,
    };

    const expectedPharmacyDrugPrice1: IPharmacyDrugPrice = {
      pharmacy: featuredPharmacyMock1,
      coupon: expectedCoupon,
    };

    const expectedFeaturedPharmacyGroupResponse = {
      bestPricePharmacy: expectedPharmacyDrugPrice1,
      pharmacyPrices: [expectedSomePharmacyDrugPrice1],
    };

    expect(
      buildPharmacyResponse(
        pharmaciesWithFeaturedMock1,
        sortByPriceMock,
        limitMock,
        drugPriceNcpdpWithFeaturedMock1,
        featuredCouponMock1,
        true
      )
    ).toEqual(expectedFeaturedPharmacyGroupResponse);
  });

  it('groups featured pharmacy when there is more than 1 pharmacy and no price', () => {
    const expectedCoupon: ICouponDetails =
      mapCouponToCouponDetails(featuredCouponMock2);

    const expectedSomePharmacyDrugPrice2: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock2,
      coupon: expectedCoupon,
    };

    const expectedPharmacyDrugPrice2: IPharmacyDrugPrice = {
      pharmacy: featuredPharmacyMock2,
      coupon: expectedCoupon,
      otherPharmacies: [expectedSomePharmacyDrugPrice2],
    };

    const expectedFeaturedPharmacyGroupResponse = {
      bestPricePharmacy: expectedPharmacyDrugPrice2,
      pharmacyPrices: [],
    };

    expect(
      buildPharmacyResponse(
        pharmaciesWithFeaturedMock2,
        sortByPriceMock,
        limitMock,
        drugPriceNcpdpWithFeaturedMock2,
        featuredCouponMock2,
        true
      )
    ).toEqual(expectedFeaturedPharmacyGroupResponse);
  });

  it('groups featured pharmacy when there is more than 1 pharmacy and same price', () => {
    const expectedCoupon: ICouponDetails =
      mapCouponToCouponDetails(featuredCouponMock3);

    const expectedSomePharmacyDrugPrice3: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock3,
      coupon: expectedCoupon,
      price: someDrugPriceMock3,
      dualPrice: someDualDrugPriceMock3,
    };

    const expectedPharmacyDrugPrice3: IPharmacyDrugPrice = {
      pharmacy: featuredPharmacyMock3,
      coupon: expectedCoupon,
      price: featuredDrugPriceMock3,
      dualPrice: featuredDualDrugPriceMock3,
      otherPharmacies: [expectedSomePharmacyDrugPrice3],
    };

    const expectedFeaturedPharmacyGroupResponse = {
      bestPricePharmacy: expectedPharmacyDrugPrice3,
      pharmacyPrices: [],
    };

    expect(
      buildPharmacyResponse(
        pharmaciesWithFeaturedMock3,
        sortByPriceMock,
        limitMock,
        drugPriceNcpdpWithFeaturedMock3,
        featuredCouponMock3,
        true
      )
    ).toEqual(expectedFeaturedPharmacyGroupResponse);
  });

  it('groups featured pharmacy when there is more than 1 pharmacy and some have matching, different, or no price', () => {
    const expectedCoupon: ICouponDetails =
      mapCouponToCouponDetails(featuredCouponMock4);

    const expectedSomePharmacyDrugPrice4a: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock4a,
      price: someDrugPriceMock4a,
      dualPrice: someDualDrugPriceMock4a,
      coupon: expectedCoupon,
    };

    const expectedSomePharmacyDrugPrice4b: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock4b,
      coupon: expectedCoupon,
    };

    const expectedSomePharmacyDrugPrice4c: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock4c,
      price: someDrugPriceMock4c,
      dualPrice: someDualDrugPriceMock4c,
      coupon: expectedCoupon,
    };

    const expectedFeaturedPharmacyDrugPrice4: IPharmacyDrugPrice = {
      pharmacy: featuredPharmacyMock4,
      coupon: expectedCoupon,
      price: featuredDrugPriceMock4,
      dualPrice: featuredDualDrugPriceMock4,
      otherPharmacies: [expectedSomePharmacyDrugPrice4c],
    };

    const expectedFeaturedPharmacyGroupResponse = {
      bestPricePharmacy: expectedFeaturedPharmacyDrugPrice4,
      pharmacyPrices: [
        expectedSomePharmacyDrugPrice4a,
        expectedSomePharmacyDrugPrice4b,
      ],
    };

    expect(
      buildPharmacyResponse(
        pharmaciesWithFeaturedMock4,
        sortByPriceMock,
        limitMock,
        drugPriceNcpdpWithFeaturedMock4,
        featuredCouponMock4,
        true
      )
    ).toEqual(expectedFeaturedPharmacyGroupResponse);
  });

  it('groups best price pharmacy when no featured', () => {
    const expectedSomePharmacyDrugPriceMock5b: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock5b,
      price: someDrugPriceMock5b,
      dualPrice: someDualDrugPriceMock5b,
      coupon: undefined,
    };

    const expectedSomePharmacyDrugPriceMock5c: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock5c,
      price: someDrugPriceMock5c,
      dualPrice: someDualDrugPriceMock5c,
      coupon: undefined,
    };

    const expectedSomePharmacyDrugPriceMock5d: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock5d,
      price: someDrugPriceMock5d,
      dualPrice: someDualDrugPriceMock5d,
      coupon: undefined,
    };

    const expectedBestPricePharmacyDrugPrice: IPharmacyDrugPrice = {
      pharmacy: somePharmacyMock5a,
      price: someDrugPriceMock5a,
      dualPrice: someDualDrugPriceMock5a,
      otherPharmacies: [
        expectedSomePharmacyDrugPriceMock5b,
        expectedSomePharmacyDrugPriceMock5c,
      ],
      coupon: undefined,
    };

    const expectedFeaturedPharmacyGroupResponse = {
      bestPricePharmacy: expectedBestPricePharmacyDrugPrice,
      pharmacyPrices: [expectedSomePharmacyDrugPriceMock5d],
    };

    const somePharmaciesMock5: IPharmacy[] = [
      somePharmacyMock5a,
      somePharmacyMock5b,
      somePharmacyMock5c,
      somePharmacyMock5d,
    ];

    const drugPriceNcpdpMock5: IDrugPriceNcpdp[] = [
      someDrugPriceNcpdpMock5a,
      someDrugPriceNcpdpMock5b,
      someDrugPriceNcpdpMock5c,
      someDrugPriceNcpdpMock5d,
    ];

    expect(
      buildPharmacyResponse(
        somePharmaciesMock5,
        sortByPriceMock,
        limitMock,
        drugPriceNcpdpMock5,
        undefined,
        true
      )
    ).toEqual(expectedFeaturedPharmacyGroupResponse);
  });
});
