// Copyright 2021 Prescryptive Health, Inc.

import { ShoppingDispatch } from './shopping.dispatch';
import { prescriptionPharmaciesSetAction } from '../actions/prescription-pharmacies-set.action';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { IPharmacyDrugPriceResponse } from '../../../../../models/api-response/pharmacy-price-search.response';
import { setNoPharmacyErrorDispatch } from './set-no-pharmacy-error.dispatch';
import { setHasInsuranceDispatch } from './set-has-insurance.dispatch';

export const setPrescriptionPharmaciesDispatch = (
  dispatch: ShoppingDispatch,
  pharmacies: IPharmacyDrugPriceResponse,
  prescriptionId: string,
  error?: string
): void => {
  if (error) {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.PRESCRIPTION_USER_GET_PHARMACIES_ERROR,
      {
        error,
        prescriptionId,
      }
    );
  } else {
    const pharmaciesInfo = pharmacies.pharmacyPrices.map((pharmacy) => {
      return { names: pharmacy.pharmacy.name, ncpdp: pharmacy.pharmacy.ncpdp };
    });
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.PRESCRIPTION_USER_GET_PHARMACIES,
      {
        pharmacies: pharmaciesInfo,
        prescriptionId,
      }
    );
  }
  dispatch(
    prescriptionPharmaciesSetAction(
      pharmacies.pharmacyPrices,
      pharmacies.bestPricePharmacy,
      error
    )
  );
  const hasInsurance = !!pharmacies.pharmacyPrices.find((pharmacyPrice) => {
    return pharmacyPrice.price?.insurancePrice !== undefined;
  });
  setHasInsuranceDispatch(dispatch, hasInsurance);
  setNoPharmacyErrorDispatch(
    dispatch,
    pharmacies.bestPricePharmacy || pharmacies.pharmacyPrices.length > 0
      ? false
      : true
  );
};
