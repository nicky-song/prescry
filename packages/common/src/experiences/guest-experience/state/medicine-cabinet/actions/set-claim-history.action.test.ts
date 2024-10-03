// Copyright 2022 Prescryptive Health, Inc.

import { claimHistoryMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { setClaimHistoryAction } from './set-claim-history.action';

describe('setClaimHistoryAction', () => {
  it('returns action', () => {
    const action = setClaimHistoryAction(claimHistoryMock);
    expect(action.type).toEqual('SET_CLAIM_HISTORY');

    expect(action.payload).toEqual({
      claimHistory: claimHistoryMock,
    });
  });
});
