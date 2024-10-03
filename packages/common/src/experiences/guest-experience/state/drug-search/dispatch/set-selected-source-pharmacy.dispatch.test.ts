// Copyright 2021 Prescryptive Health, Inc.

import { selectedPharmacyMock } from '../../../__mocks__/selected-pharmacy.mock';
import { setSelectedSourcePharmacyAction } from '../actions/set-selected-source-pharmacy.action';
import { setSelectedSourcePharmacyDispatch } from './set-selected-source-pharmacy.dispatch';

describe('setSelectedSourcePharmacyDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    setSelectedSourcePharmacyDispatch(dispatchMock, selectedPharmacyMock);

    const expectedAction = setSelectedSourcePharmacyAction(
      selectedPharmacyMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
