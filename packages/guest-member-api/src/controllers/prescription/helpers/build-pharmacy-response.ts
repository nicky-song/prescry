// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { IPharmacyDrugPrice } from '@phx/common/src/models/pharmacy-drug-price';
import { ICoupon, ICouponProvider } from '../../../models/coupon';
import { IPharmacyDrugPriceResponse } from '@phx/common/src/models/api-response/pharmacy-price-search.response';
import { pharmacyDrugPriceGrouper } from './pharmacy-drug-price.grouper';
import isMailOrderOnly from './is-mail-order-only';
import { IDrugPriceNcpdp } from '../../../models/drug-price-ncpdp';
import { mapCouponToCouponDetails } from './map-coupon-to-coupon-details';

export const buildPharmacyResponse = (
  pharmacies: IPharmacy[],
  sortBy: string,
  limit: number,
  pharmacyPrices: IDrugPriceNcpdp[],
  coupon?: ICoupon,
  showAllPharmacies?: boolean,
  useDualPrice?: boolean
): IPharmacyDrugPriceResponse => {
  const hasCoupon = !!coupon;

  const pharmacyDrugPriceList: IPharmacyDrugPrice[] = [];
  const couponInfo = hasCoupon
    ? mapCouponToCouponDetails(coupon as ICoupon)
    : undefined;
  pharmacies.forEach((pharmacy) => {
    const pharmacyIsMailOrderOnly = isMailOrderOnly(
      pharmacy.nationalProviderIdentifier
    );
    const pharmacyIsFeatured = isPharmacyFeatured(pharmacy.ncpdp, coupon);
    const pharmacyIsInCouponNetwork = isPharmacyInCouponNetwork(
      pharmacy.ncpdp,
      coupon
    );

    if (
      !hasCoupon ||
      (pharmacyIsMailOrderOnly
        ? pharmacyIsFeatured
        : !showAllPharmacies
        ? pharmacyIsInCouponNetwork
        : true)
    ) {
      const pharmacyDrugPrice: IPharmacyDrugPrice = { pharmacy };
      const pharmacyPrice = pharmacyPrices.find(
        (pharmPrice) => pharmPrice.ncpdp === pharmacy.ncpdp
      );

      if (pharmacyPrice) {
        pharmacyDrugPrice.price = pharmacyPrice.price;
        pharmacyDrugPrice.dualPrice = pharmacyPrice.dualPrice;
        
        pharmacyDrugPrice.pharmacy.inNetwork = true;
      } else {
        pharmacyDrugPrice.pharmacy.inNetwork = false;
      }

      if (pharmacyIsFeatured || pharmacyIsInCouponNetwork) {
        pharmacyDrugPrice.coupon = couponInfo;
      }
      if (pharmacyDrugPrice.price || pharmacyIsFeatured || showAllPharmacies) {
        pharmacyDrugPriceList.push(pharmacyDrugPrice);
      }
    }
  });

  const getBestPricePharmacy = (index: number) => {
    const bestPrice = index > -1 ? pharmacyDrugPriceList[index] : undefined;
    if (index > -1) {
      pharmacyDrugPriceList.splice(index, 1);
    }
    return bestPrice;
  };

  const featuredProviderIndex = pharmacyDrugPriceList.findIndex(
    (x) => x.pharmacy.ncpdp === coupon?.FeaturedCouponProvider?.NCPDP
  );

  const bestPricePharmacyIndex =
    featuredProviderIndex === -1
      ? getBestPricePharmacyIndex(pharmacyDrugPriceList)
      : featuredProviderIndex;

  const bestPricePharmacy = getBestPricePharmacy(bestPricePharmacyIndex);

  if (useDualPrice) {
    sortingByDualPrice(pharmacyDrugPriceList, sortBy);
  } else {
    sortingByPrice(pharmacyDrugPriceList, sortBy);
  }

  const finalPharmacyResponse = {
    bestPricePharmacy,
    pharmacyPrices: pharmacyDrugPriceList,
  };

  const bestPricePharmacyGroup = finalPharmacyResponse.bestPricePharmacy;
  const groupedPharmacyDrugPrice = pharmacyDrugPriceGrouper(
    pharmacyDrugPriceList
  );

  finalPharmacyResponse.pharmacyPrices =
    groupedPharmacyDrugPrice.length > limit - 1
      ? groupedPharmacyDrugPrice.slice(0, limit - 1)
      : groupedPharmacyDrugPrice;

  const pharmacyDrugPriceGroup = finalPharmacyResponse.pharmacyPrices;

  if (bestPricePharmacyGroup) {
    pharmacyDrugPriceGroup.forEach((pharmacyDrugPrice: IPharmacyDrugPrice) => {
      const isMatchingBrandAndChain =
        bestPricePharmacyGroup.pharmacy.brand?.length &&
        bestPricePharmacyGroup.pharmacy.brand ===
          pharmacyDrugPrice.pharmacy.brand &&
        (bestPricePharmacyGroup.pharmacy.chainId ||
          bestPricePharmacyGroup.pharmacy.chainId === 0) &&
        bestPricePharmacyGroup.pharmacy.chainId ===
          pharmacyDrugPrice.pharmacy.chainId;

      const isMatchingPrice =
        bestPricePharmacyGroup?.price?.memberPays ===
          pharmacyDrugPrice.price?.memberPays &&
        bestPricePharmacyGroup?.price?.planPays ===
          pharmacyDrugPrice.price?.planPays;

      const isMatchingUndefinedPrice =
        bestPricePharmacyGroup?.price === undefined &&
        pharmacyDrugPrice.price === undefined;

      const isBestPricePharmacyAndGroup =
        featuredProviderIndex === -1 &&
        isMatchingBrandAndChain &&
        isMatchingPrice;

      const isFeaturedPharmacyAndGroup =
        featuredProviderIndex >= 0 &&
        isMatchingBrandAndChain &&
        (isMatchingPrice || isMatchingUndefinedPrice);

      if (isBestPricePharmacyAndGroup || isFeaturedPharmacyAndGroup) {
        bestPricePharmacyGroup.otherPharmacies = [
          ...(bestPricePharmacyGroup.otherPharmacies ?? []),
          { ...pharmacyDrugPrice, otherPharmacies: undefined },
          ...(pharmacyDrugPrice.otherPharmacies ?? []),
        ];

        finalPharmacyResponse.bestPricePharmacy = bestPricePharmacyGroup;

        const currentPharmacyDrugPriceIndex =
          finalPharmacyResponse.pharmacyPrices.indexOf(pharmacyDrugPrice);
        finalPharmacyResponse.pharmacyPrices = [
          ...finalPharmacyResponse.pharmacyPrices.slice(
            0,
            currentPharmacyDrugPriceIndex
          ),
          ...finalPharmacyResponse.pharmacyPrices.slice(
            currentPharmacyDrugPriceIndex + 1
          ),
        ];
      }
    });
  }

  return finalPharmacyResponse;
};

export const getBestPricePharmacyIndex = (pharmacies: IPharmacyDrugPrice[]) => {
  const prices = pharmacies.map((pharmacy) =>
    pharmacy.price ? pharmacy.price.memberPays : Infinity
  );
  const minCost = Math.min(...prices);
  return minCost !== Infinity ? prices.indexOf(minCost) : -1;
};

const compareDistance = (
  a: IPharmacy,
  b: IPharmacy
): number =>
  (a.distance || a.distance === 0) && (b.distance || b.distance === 0)
    ? a.distance - b.distance
    : 0;

export const sortingByPrice = (
  priceList: IPharmacyDrugPrice[],
  attribute: string
) => {
  if (attribute === 'youpay') {
    priceList.sort((a, b) =>
      a.price && b.price
        ? a.price.memberPays - b.price.memberPays === 0
          ? a.price.planPays - b.price.planPays === 0
            ? compareDistance(a.pharmacy, b.pharmacy)
            : a.price.planPays - b.price.planPays
          : a.price.memberPays - b.price.memberPays
        : a.price
        ? -1
        : b.price
        ? 1
        : 0
    );
  } else if (attribute === 'planpays') {
    priceList.sort((a, b) =>
      a.price && b.price
        ? a.price.planPays - b.price.planPays === 0
          ? a.price.memberPays - b.price.memberPays === 0
            ? compareDistance(a.pharmacy, b.pharmacy)
            : a.price.memberPays - b.price.memberPays
          : a.price.planPays - b.price.planPays
        : a.price
        ? -1
        : b.price
        ? 1
        : 0
    );
  } else if (attribute === 'distance') {
    priceList.sort((a, b) => {
      const distDiff = compareDistance(a.pharmacy, b.pharmacy);
      
      return (
        distDiff === 0
          ? a.price && b.price
            ? a.price.memberPays - b.price.memberPays === 0
              ? a.price.planPays - b.price.planPays
              : a.price.memberPays - b.price.memberPays
            : 0
          : distDiff
      );
    });
  }
};

export const sortingByDualPrice = (
  priceList: IPharmacyDrugPrice[],
  attribute: string
) => {
  priceList.sort((a, b) => {
    if (a.dualPrice && b.dualPrice) {
      const aMemberPays: number = a.dualPrice.pbmMemberPays || a.dualPrice.smartPriceMemberPays || 0;
      const bMemberPays: number = b.dualPrice.pbmMemberPays || b.dualPrice.smartPriceMemberPays || 0;

      const aPlanPays: number = a.dualPrice.pbmPlanPays || 0;
      const bPlanPays: number = b.dualPrice.pbmPlanPays || 0;

      const distDiff = compareDistance(a.pharmacy, b.pharmacy);

      switch (attribute) {
        case 'youpay':
          return (
            aMemberPays - bMemberPays === 0
              ? aPlanPays - bPlanPays === 0
                ? compareDistance(a.pharmacy, b.pharmacy)
                : aPlanPays - bPlanPays
              : aMemberPays - bMemberPays
          );
        case 'planpays':
          return (
            aPlanPays - bPlanPays === 0
              ? aMemberPays - bMemberPays === 0
                ? compareDistance(a.pharmacy, b.pharmacy)
                : aMemberPays - bMemberPays
              : aPlanPays - bPlanPays
          );
        case 'distance':
          return (
            distDiff === 0
              ? aMemberPays - bMemberPays === 0
                ? aPlanPays - bPlanPays
                : aMemberPays - bMemberPays
              : distDiff
          );
        default:
          return 0;
      }
    }
    else if (a.dualPrice && !b.dualPrice) {
      return -1;
    }
    else if (!a.dualPrice && b.dualPrice) {
      return 1;
    }
    else {
      return 0;
    }
  });
};

const isOpenNetwork = (coupon?: ICoupon) =>
  (coupon?.CouponProviders?.length ?? 0) === 0;

export const isPharmacyFeatured = (ncpdp: string, coupon?: ICoupon) =>
  coupon?.FeaturedCouponProvider?.NCPDP === ncpdp;

export const isPharmacyInCouponNetwork = (ncpdp: string, coupon?: ICoupon) =>
  isOpenNetwork(coupon) ||
  (coupon?.CouponProviders?.some(
    (couponProvider: ICouponProvider) => couponProvider.NCPDP === ncpdp
  ) ??
    false);
