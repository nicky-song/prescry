// Copyright 2022 Prescryptive Health, Inc.

import { setHasInsuranceAction } from '../actions/set-has-insurance.action';
import { setHasInsuranceDispatch } from './set-has-insurance.dispatch';

describe('setHasInsuranceDispatch', () => {
  it.each([[true], [false]])(
    'dispatches expected action when hasInsurance is %s',
    (isGettingPharmaciesMock: boolean) => {
      const shoppingDispatchMock = jest.fn();

      setHasInsuranceDispatch(shoppingDispatchMock, isGettingPharmaciesMock);

      const expectedAction = setHasInsuranceAction(isGettingPharmaciesMock);
      expect(shoppingDispatchMock).toHaveBeenCalledWith(expectedAction);
    }
  );
});
