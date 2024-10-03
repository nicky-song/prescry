// Copyright 2021 Prescryptive Health, Inc.

import { pharmacyDrugPrice1Mock } from '../../../__mocks__/pharmacy-drug-price.mock';
import { setSelectedPharmacyAction } from '../actions/set-selected-pharmacy.action';
import { setSelectedPharmacyDispatch } from './set-selected-pharmacy.dispatch';

describe('setSelectedPharmacyDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    setSelectedPharmacyDispatch(dispatchMock, pharmacyDrugPrice1Mock);

    const expectedAction = setSelectedPharmacyAction(pharmacyDrugPrice1Mock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
