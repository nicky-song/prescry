// Copyright 2021 Prescryptive Health, Inc.

import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import { setDrugPriceResultsAction } from '../actions/set-drug-price-results.action';
import { setDrugPriceResponseDispatch } from './set-drug-price-response.dispatch';

describe('setDrugPriceResponseDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setDrugPriceResponseDispatch(dispatchMock, [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ]);

    const expectedAction = setDrugPriceResultsAction([
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ]);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
