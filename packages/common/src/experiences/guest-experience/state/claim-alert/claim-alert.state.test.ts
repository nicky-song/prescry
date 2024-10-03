// Copyright 2022 Prescryptive Health, Inc.

import { IClaimAlertState, defaultClaimAlertState } from './claim-alert.state';

describe('ClaimAlertState', () => {
  it('has expected default state', () => {
    const expectedState: IClaimAlertState = {};

    expect(defaultClaimAlertState).toEqual(expectedState);
  });
});
