// Copyright 2022 Prescryptive Health, Inc.

import { setIsGettingPharmaciesAction } from '../actions/set-is-getting-pharmacies.action';
import { setIsGettingPharmaciesDispatch } from './set-is-getting-pharmacies.dispatch';

describe('setIsGettingPharmaciesDispatch', () => {
  it.each([[true], [false]])(
    'dispatches expected action when isGettingPharmacies is %s',
    (isGettingPharmaciesMock: boolean) => {
      const drugSearchDispatchMock = jest.fn();

      setIsGettingPharmaciesDispatch(
        drugSearchDispatchMock,
        isGettingPharmaciesMock
      );

      const expectedAction = setIsGettingPharmaciesAction(
        isGettingPharmaciesMock
      );
      expect(drugSearchDispatchMock).toHaveBeenCalledWith(expectedAction);
    }
  );
});
