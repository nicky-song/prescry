// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeDrugPrice } from '../../../../../models/alternative-drug-price';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { setAlternativeDrugResultsAction } from '../actions/set-alternative-drug-price-results.action';
import { ShoppingDispatch } from './shopping.dispatch';

export const setAlternativeDrugPriceResponseDispatch = (
  dispatch: ShoppingDispatch,
  alternativeDrugPrice?: IAlternativeDrugPrice,
  error?: string
): void => {
  if (error) {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.ALTERNATIVE_DRUG_SEARCH_ERROR,
      {
        error,
      }
    );
  }

  dispatch(setAlternativeDrugResultsAction(alternativeDrugPrice));
};
