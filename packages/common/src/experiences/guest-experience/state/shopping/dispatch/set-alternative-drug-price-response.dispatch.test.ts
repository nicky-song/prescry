// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeDrugPrice } from '../../../../../models/alternative-drug-price';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { setAlternativeDrugResultsAction } from '../actions/set-alternative-drug-price-results.action';
import { setAlternativeDrugPriceResponseDispatch } from './set-alternative-drug-price-response.dispatch';

jest.mock('../../../guest-experience-logger.middleware', () => ({
  ...jest.requireActual('../../../guest-experience-logger.middleware'),
  guestExperienceCustomEventLogger: jest.fn(),
}));
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock('../actions/set-alternative-drug-price-results.action');
const setAlternativeDrugResultsActionMock =
  setAlternativeDrugResultsAction as jest.Mock;

const dispatchMock = jest.fn();
const alternativeDrugPriceMock = {} as IAlternativeDrugPrice;
const errorMock = 'error-mock';

describe('setAlternativeDrugPriceResponseDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls guestExperienceCustomEventLogger if error is truthy', () => {
    setAlternativeDrugPriceResponseDispatch(
      dispatchMock,
      alternativeDrugPriceMock,
      errorMock
    );

    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledTimes(1);
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenNthCalledWith(
      1,
      CustomAppInsightEvents.ALTERNATIVE_DRUG_SEARCH_ERROR,
      {
        error: errorMock,
      }
    );
  });

  it('dispatches setAlternativeDrugResultsAction for alternativeDrugPrice', () => {
    setAlternativeDrugPriceResponseDispatch(
      dispatchMock,
      alternativeDrugPriceMock,
      errorMock
    );

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenNthCalledWith(
      1,
      setAlternativeDrugResultsActionMock(alternativeDrugPriceMock)
    );
  });
});
