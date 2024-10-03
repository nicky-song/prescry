// Copyright 2021 Prescryptive Health, Inc.

import {
  setNoPharmacyErrorAction,
  setNoPharmacyErrorDispatch,
} from './set-no-pharmacy-error.dispatch';

describe('setNoPharmacyErrorDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const noPharmaciesFoundMock = false;
    setNoPharmacyErrorDispatch(dispatchMock, noPharmaciesFoundMock);

    const expectedAction = setNoPharmacyErrorAction(noPharmaciesFoundMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
