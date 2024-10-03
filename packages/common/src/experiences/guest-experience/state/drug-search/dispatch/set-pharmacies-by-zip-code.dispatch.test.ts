// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../../../models/pharmacy';
import { pharmaciesByZipcodeAppendAction } from '../actions/pharmacies-by-zip-code-append.action';
import { pharmaciesByZipcodeSetAction } from '../actions/pharmacies-by-zip-code-set.action';
import { setPharmaciesByZipCodeDispatch } from './set-pharmacies-by-zip-code.dispatch';

describe('setPharmaciesByZipCodeDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const pharmaciesMock = [{ name: 'pharmacy-name' }] as IPharmacy[];

    setPharmaciesByZipCodeDispatch(dispatchMock, pharmaciesMock);

    const expectedAction = pharmaciesByZipcodeSetAction(pharmaciesMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches append action if has previous pharmacies', () => {
    const dispatchMock = jest.fn();
    const pharmaciesMock = [{ name: 'pharmacy-name' }] as IPharmacy[];

    setPharmaciesByZipCodeDispatch(dispatchMock, pharmaciesMock, true);

    const expectedAction = pharmaciesByZipcodeAppendAction(pharmaciesMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
