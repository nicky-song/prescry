// Copyright 2021 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import { setDrugPriceResultsAction } from '../actions/set-drug-price-results.action';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';

export const setDrugPriceResponseDispatch = (
  dispatch: DrugSearchDispatch,
  pharmacies: IPharmacyDrugPrice[],
  bestPricePharmacy?: IPharmacyDrugPrice,
  error?: string
): void => {
  if (error) {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.DRUG_SEARCH_USER_GET_PHARMACIES_ERROR,
      {
        error,
      }
    );
  }
  dispatch(setDrugPriceResultsAction(pharmacies, bestPricePharmacy, error));
};
