// Copyright 2022 Prescryptive Health, Inc.

import { medicineCabinetStateMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { setClaimHistoryAction } from '../actions/set-claim-history.action';
import { setClaimHistoryDispatch } from './set-claim-history.dispatch';

describe('setClaimHistoryDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setClaimHistoryDispatch(
      dispatchMock,
      medicineCabinetStateMock.claimHistory
    );

    const expectedAction = setClaimHistoryAction(
      medicineCabinetStateMock.claimHistory
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
