// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { SuccessConstants } from '../../constants/response-messages';
import { buildPharmacyResponse } from '../../controllers/prescription/helpers/build-pharmacy-response';
import { getPharmacyDetailsByNcpdp } from '../../controllers/prescription/helpers/get-pharmacy-details-by-ncpdp';
import { KnownFailureResponse, SuccessResponse } from '../response-helper';
import { getCouponByNdcAndQuantity } from './get-coupon-by-ndc-and-quantity';
import { getPricesForNdcAndPharmacies } from './get-prices-for-pharmacies-and-ndc';
import { getPharmaciesAndPricesForNdc } from './get-pharmacy-and-prices-for-ndc';
import { configurationMock } from '../../mock-data/configuration.mock';
import { couponMock } from '../../mock-data/coupon.mock';
import { prescriptionPharmacyMock2 } from '../../mock-data/prescription-pharmacy.mock';
import {
  pbmPriceMock1,
  pbmPriceMock2,
  smartPriceMock1,
  smartPriceMock2,
} from '../../mock-data/drug-price-ncpdp.mock';
import { IDrugPriceNcpdp } from '../../models/drug-price-ncpdp';
import { IPharmacyDrugPriceResponse } from '@phx/common/src/models/api-response/pharmacy-price-search.response';
import { IPrescriptionPharmacy } from '../../models/platform/pharmacy-lookup.response';
import { searchAndCacheNearbyPharmaciesForCoordinates } from './search-and-cache-nearby-pharmacies-for-coordinates';
import { pharmacyMock5, pharmacyMock6 } from '../../mock-data/pharmacy.mock';

jest.mock('../../controllers/prescription/helpers/build-pharmacy-response');
const buildPharmacyResponseMock = buildPharmacyResponse as jest.Mock;

jest.mock(
  '../../controllers/prescription/helpers/get-pharmacy-details-by-ncpdp'
);
const getPharmacyDetailsByNcpdpMock = getPharmacyDetailsByNcpdp as jest.Mock;

jest.mock('../response-helper');
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;

jest.mock('./get-coupon-by-ndc-and-quantity');
const getCouponByNdcAndQuantityMock = getCouponByNdcAndQuantity as jest.Mock;

jest.mock('./get-prices-for-pharmacies-and-ndc');
const getPricesForNdcAndPharmaciesMock =
  getPricesForNdcAndPharmacies as jest.Mock;

jest.mock('./search-and-cache-nearby-pharmacies-for-coordinates');

jest.mock('../../controllers/prescription/helpers/build-pharmacy-response');
const searchAndCacheNearbyPharmaciesForCoordinatesMock =
  searchAndCacheNearbyPharmaciesForCoordinates as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  getCouponByNdcAndQuantityMock.mockReturnValue({ coupon: undefined });
});

const responseMock = {} as Response;
const distanceMock = 100;
const memberIdMock = 'member-id';
const groupPlanCodeMock = 'gpc';
const groupPlanCodeCashMock = 'CASH01';
const sortingAttributeMock = 'price';
const limitMock = 20;
const ndcMock = 'mock-ndc';
const quantityMock = 1;
const daySupplyMock = 30;
const latitudeMock = 43.141649;
const longitudeMock = -85.04948;
const rxNumberMock = 'mock-rx-number';
const refillMock = '10';
const prescriberNpiMock = 'prescriber-npi-mock';
const isRTPBMock = true;
const useDualPriceMock = true;
const useTestThirdPartyPricingMock = false;

describe('getPharmaciesAndPricesForNdc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Return error if coordinate api return error and no coupons', async () => {
    const mockErrorMessage = 'mock-error';
    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockResolvedValue({
      errorCode: 400,
      message: mockErrorMessage,
    });
    await getPharmaciesAndPricesForNdc(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      daySupplyMock,
      refillMock,
      rxNumberMock
    );
    expect(
      searchAndCacheNearbyPharmaciesForCoordinatesMock
    ).toHaveBeenCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      distanceMock
    );
    expect(getPricesForNdcAndPharmaciesMock).not.toHaveBeenCalled();
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      400,
      mockErrorMessage
    );
    expect(getCouponByNdcAndQuantityMock).not.toHaveBeenCalled();
    expect(buildPharmacyResponseMock).not.toHaveBeenCalled();
  });

  it('Return error if coordinate api return error for CASH user and coupon does not have featured provider', async () => {
    const mockErrorMessage = 'mock-error';
    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockReturnValueOnce({
      errorCode: 400,
      message: mockErrorMessage,
    });
    getCouponByNdcAndQuantityMock.mockReturnValueOnce({
      coupon: couponMock,
    });
    await getPharmaciesAndPricesForNdc(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      daySupplyMock,
      refillMock,
      rxNumberMock,
      undefined
    );
    expect(
      searchAndCacheNearbyPharmaciesForCoordinatesMock
    ).toHaveBeenCalledWith(
      configurationMock,
      latitudeMock,
      longitudeMock,
      distanceMock
    );
    expect(getPricesForNdcAndPharmaciesMock).not.toHaveBeenCalled();
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      400,
      mockErrorMessage
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(buildPharmacyResponseMock).not.toHaveBeenCalled();
  });
  it('Return pharmacy information if coordinate api return success: PBM User', async () => {
    const mockPharmacies = [pharmacyMock5, pharmacyMock6];

    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockReturnValueOnce({
      pharmacies: mockPharmacies,
    });
    const mockPharmacyPrice: IDrugPriceNcpdp[] = [pbmPriceMock1, pbmPriceMock2];

    getPricesForNdcAndPharmaciesMock.mockReturnValueOnce(mockPharmacyPrice);
    const expectedPharmacyResponse = {} as IPharmacyDrugPriceResponse;
    buildPharmacyResponseMock.mockReturnValueOnce(expectedPharmacyResponse);
    await getPharmaciesAndPricesForNdc(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      daySupplyMock,
      refillMock,
      rxNumberMock,
      true,
      isRTPBMock,
      prescriberNpiMock,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );

    expect(getPricesForNdcAndPharmaciesMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      daySupplyMock,
      ['4902234', '4921575'],
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock,
      isRTPBMock,
      prescriberNpiMock,
      false,
      useTestThirdPartyPricingMock
    );
    expect(buildPharmacyResponseMock).toHaveBeenCalledWith(
      mockPharmacies,
      sortingAttributeMock,
      limitMock,
      mockPharmacyPrice,
      undefined,
      true,
      useDualPriceMock
    );

    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedPharmacyResponse
    );
  });

  it('Return pharmacy information if coordinate api return success: CASH User', async () => {
    const mockPharmacies = [pharmacyMock5, pharmacyMock6];

    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockReturnValueOnce({
      pharmacies: mockPharmacies,
    });
    const mockPharmacyPrice: IDrugPriceNcpdp[] = [
      smartPriceMock1,
      smartPriceMock2,
    ];

    getPricesForNdcAndPharmaciesMock.mockReturnValueOnce(mockPharmacyPrice);
    const expectedPharmacyResponse = {} as IPharmacyDrugPriceResponse;
    buildPharmacyResponseMock.mockReturnValueOnce(expectedPharmacyResponse);
    await getPharmaciesAndPricesForNdc(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      daySupplyMock,
      refillMock,
      rxNumberMock,
      false,
      isRTPBMock,
      prescriberNpiMock,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(getPricesForNdcAndPharmaciesMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      daySupplyMock,
      ['4902234', '4921575'],
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      refillMock,
      rxNumberMock,
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(buildPharmacyResponseMock).toHaveBeenCalledWith(
      mockPharmacies,
      sortingAttributeMock,
      limitMock,
      mockPharmacyPrice,
      undefined,
      false,
      useDualPriceMock
    );
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedPharmacyResponse
    );
  });

  it('Return pharmacy information if coordinate api return success: CASH User with coupon', async () => {
    getCouponByNdcAndQuantityMock.mockReturnValueOnce({
      coupon: couponMock,
    });
    const mockPharmacies = [pharmacyMock5, pharmacyMock6];
    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockReturnValueOnce({
      pharmacies: mockPharmacies,
    });
    const mockPharmacyPrice: IDrugPriceNcpdp[] = [
      smartPriceMock1,
      smartPriceMock2,
    ];

    getPricesForNdcAndPharmaciesMock.mockReturnValueOnce(mockPharmacyPrice);

    const expectedPharmacyResponse = {} as IPharmacyDrugPriceResponse;
    buildPharmacyResponseMock.mockReturnValueOnce(expectedPharmacyResponse);
    await getPharmaciesAndPricesForNdc(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      daySupplyMock,
      refillMock,
      rxNumberMock,
      false,
      isRTPBMock,
      prescriberNpiMock,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(getPricesForNdcAndPharmaciesMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      daySupplyMock,
      ['4902234', '4921575'],
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      refillMock,
      rxNumberMock,
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedPharmacyResponse
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(buildPharmacyResponseMock).toHaveBeenCalledWith(
      mockPharmacies,
      sortingAttributeMock,
      limitMock,
      mockPharmacyPrice,
      couponMock,
      false,
      useDualPriceMock
    );
  });

  it('should add Featured pharmacy to pharmacies collection', async () => {
    const featuredNcpdpMock = '4921575';
    const couponWithFeaturedMock = {
      ...couponMock,
      FeaturedCouponProvider: { NCPDP: featuredNcpdpMock },
    };
    getCouponByNdcAndQuantityMock.mockReturnValueOnce({
      coupon: couponWithFeaturedMock,
    });
    const mockPharmacies = [pharmacyMock5];
    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockReturnValueOnce({
      pharmacies: mockPharmacies,
    });
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
      prescriptionPharmacyMock2
    );
    const mockPharmacyPrice: IDrugPriceNcpdp[] = [
      smartPriceMock1,
      smartPriceMock2,
    ];

    getPricesForNdcAndPharmaciesMock.mockReturnValueOnce(mockPharmacyPrice);
    const mockPharmaciesWithFeatured = [pharmacyMock5, pharmacyMock6];
    const expectedPharmacyResponse = {} as IPharmacyDrugPriceResponse;
    buildPharmacyResponseMock.mockReturnValueOnce(expectedPharmacyResponse);
    await getPharmaciesAndPricesForNdc(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      daySupplyMock,
      refillMock,
      rxNumberMock,
      undefined,
      isRTPBMock,
      prescriberNpiMock,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(getPricesForNdcAndPharmaciesMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      daySupplyMock,
      ['4902234', featuredNcpdpMock],
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      refillMock,
      rxNumberMock,
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedPharmacyResponse
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(buildPharmacyResponseMock).toHaveBeenCalledWith(
      mockPharmaciesWithFeatured,
      sortingAttributeMock,
      limitMock,
      mockPharmacyPrice,
      couponWithFeaturedMock,
      undefined,
      useDualPriceMock
    );

    expect(getPharmacyDetailsByNcpdp).toHaveBeenCalledWith(
      featuredNcpdpMock,
      configurationMock
    );
  });
  it('should not add Featured pharmacy to pharmacies collection if already in collection', async () => {
    const featuredNcpdpMock = '4921575';
    const couponWithFeaturedMock = {
      ...couponMock,
      FeaturedCouponProvider: { NCPDP: featuredNcpdpMock },
    };
    getCouponByNdcAndQuantityMock.mockReturnValueOnce({
      coupon: couponWithFeaturedMock,
    });
    const mockPharmacies = [pharmacyMock5, pharmacyMock6];
    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockReturnValueOnce({
      pharmacies: mockPharmacies,
    });

    const mockPharmacyPrice: IDrugPriceNcpdp[] = [
      smartPriceMock1,
      smartPriceMock2,
    ];

    getPricesForNdcAndPharmaciesMock.mockReturnValueOnce(mockPharmacyPrice);

    const expectedPharmacyResponse = {} as IPharmacyDrugPriceResponse;
    buildPharmacyResponseMock.mockReturnValueOnce(expectedPharmacyResponse);
    await getPharmaciesAndPricesForNdc(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      daySupplyMock,
      refillMock,
      rxNumberMock,
      false,
      isRTPBMock,
      prescriberNpiMock,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(getPricesForNdcAndPharmaciesMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      daySupplyMock,
      ['4902234', '4921575'],
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      refillMock,
      rxNumberMock,
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedPharmacyResponse
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(buildPharmacyResponseMock).toHaveBeenCalledWith(
      mockPharmacies,
      sortingAttributeMock,
      limitMock,
      mockPharmacyPrice,
      couponWithFeaturedMock,
      false,
      useDualPriceMock
    );
    expect(getPharmacyDetailsByNcpdp).not.toHaveBeenCalled();
  });

  it('Returns SuccessResponse with empty list when there are no pharmacies', async () => {
    const mockPharmacies: IPrescriptionPharmacy[] = [];

    searchAndCacheNearbyPharmaciesForCoordinatesMock.mockReturnValueOnce({
      pharmacies: mockPharmacies,
    });
    const mockPharmacyPrice: IDrugPriceNcpdp[] = [];

    getPricesForNdcAndPharmaciesMock.mockReturnValueOnce(mockPharmacyPrice);
    const expectedPharmacyResponse = {} as IPharmacyDrugPriceResponse;
    buildPharmacyResponseMock.mockReturnValueOnce(expectedPharmacyResponse);
    await getPharmaciesAndPricesForNdc(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeCashMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      daySupplyMock,
      refillMock,
      rxNumberMock,
      false,
      undefined,
      undefined,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );
    expect(getCouponByNdcAndQuantityMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      configurationMock
    );
    expect(getPricesForNdcAndPharmaciesMock).not.toHaveBeenCalled();
    expect(buildPharmacyResponseMock).toHaveBeenCalledWith(
      mockPharmacies,
      sortingAttributeMock,
      limitMock,
      mockPharmacyPrice,
      undefined,
      false,
      useDualPriceMock
    );
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedPharmacyResponse
    );
  });
});
