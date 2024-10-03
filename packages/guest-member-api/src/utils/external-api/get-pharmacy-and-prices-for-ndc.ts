// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPharmacyDrugPriceResponse } from '@phx/common/src/models/api-response/pharmacy-price-search.response';
import { IConfiguration } from '../../configuration';
import { HttpStatusCodes } from '../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../constants/response-messages';
import { buildPharmacyResponse } from '../../controllers/prescription/helpers/build-pharmacy-response';
import { getPharmacyDetailsByNcpdp } from '../../controllers/prescription/helpers/get-pharmacy-details-by-ncpdp';
import { ICoupon } from '../../models/coupon';
import { isSmartpriceUser } from '../is-smart-price-eligible';
import { KnownFailureResponse, SuccessResponse } from '../response-helper';
import {
  ICouponResponse,
  getCouponByNdcAndQuantity,
} from './get-coupon-by-ndc-and-quantity';
import { getPricesForNdcAndPharmacies } from './get-prices-for-pharmacies-and-ndc';
import {
  IPharmacySearchAndCacheResponse,
  searchAndCacheNearbyPharmaciesForCoordinates,
} from './search-and-cache-nearby-pharmacies-for-coordinates';
import { convertPrescriptionPharmacyToPharmacy } from '../convert-prescription-pharmacy-to-pharmacy';

export async function getPharmaciesAndPricesForNdc(
  response: Response,
  latitude: number,
  longitude: number,
  distance: number,
  configuration: IConfiguration,
  memberId: string,
  groupPlanCode: string,
  sortBy: string,
  limit: number,
  ndc: string,
  quantity: number,
  daysSupply: number,
  refillNumber: string,
  rxNumber: string,
  showAllPharmacies?: boolean,
  isRTPB?: boolean,
  prescriberNpi?: string,
  useDualPrice?: boolean,
  useTestThirdPartyPricing?: boolean
): Promise<Response> {
  const isSmartPriceEligible = isSmartpriceUser(groupPlanCode);
  let featuredNCPDP: string | undefined;
  let coupon: ICoupon | undefined;
  if (isSmartPriceEligible) {
    const couponApiResponse: ICouponResponse = await getCouponByNdcAndQuantity(
      ndc,
      quantity,
      configuration
    );
    coupon = couponApiResponse.coupon;
    featuredNCPDP = coupon?.FeaturedCouponProvider?.NCPDP;
  }

  const coordinateSearchResponse: IPharmacySearchAndCacheResponse =
    await searchAndCacheNearbyPharmaciesForCoordinates(
      configuration,
      latitude,
      longitude,
      distance
    );

  const { pharmacies = [], errorCode } = coordinateSearchResponse;

  if (featuredNCPDP) {
    if (!pharmacies.some((pharm) => pharm.ncpdp === featuredNCPDP)) {
      const featuredPharmacyDetails = await getPharmacyDetailsByNcpdp(
        featuredNCPDP,
        configuration
      );
      if (featuredPharmacyDetails) {
        const featuredPharmacy = convertPrescriptionPharmacyToPharmacy(
          featuredPharmacyDetails
        );
        pharmacies.push(featuredPharmacy);
      }
    }
  }

  if (!errorCode) {
    if (pharmacies.length === 0) {
      return SuccessResponse<IPharmacyDrugPriceResponse>(
        response,
        SuccessConstants.SUCCESS_OK,
        buildPharmacyResponse(
          pharmacies,
          sortBy,
          limit,
          [],
          coupon,
          showAllPharmacies,
          useDualPrice
        )
      );
    }

    const pharmacyPrices = await getPricesForNdcAndPharmacies(
      ndc,
      quantity,
      daysSupply,
      pharmacies.map((x) => x.ncpdp),
      configuration,
      memberId,
      groupPlanCode,
      refillNumber,
      rxNumber,
      isRTPB,
      prescriberNpi,
      isSmartPriceEligible,
      useTestThirdPartyPricing
    );

    return SuccessResponse<IPharmacyDrugPriceResponse>(
      response,
      SuccessConstants.SUCCESS_OK,
      buildPharmacyResponse(
        pharmacies,
        sortBy,
        limit,
        pharmacyPrices,
        coupon,
        showAllPharmacies,
        useDualPrice
      )
    );
  }
  return KnownFailureResponse(
    response,
    coordinateSearchResponse.errorCode || HttpStatusCodes.INTERNAL_SERVER_ERROR,
    coordinateSearchResponse.message || ErrorConstants.ERROR_COORDINATES_SEARCH
  );
}
