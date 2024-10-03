// Copyright 2022 Prescryptive Health, Inc.

import { setHasInsuranceAction } from './set-has-insurance.action';

describe('setHasInsuranceAction', () => {
  it.each([[true], [false]])(
    'returns action when hasInsurance is %s',
    (hasInsurance: boolean) => {
      const action = setHasInsuranceAction(hasInsurance);
      expect(action.type).toEqual('SET_HAS_INSURANCE');
      expect(action.payload).toEqual({
        hasInsurance,
      });
    }
  );
});
