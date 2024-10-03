// Copyright 2022 Prescryptive Health, Inc.

import { claimAlertMock } from '../../__mocks__/claim-alert.mock';
import { setClaimAlertAction } from './actions/set-claim-alert.action';
import { claimAlertReducer } from './claim-alert.reducer';
import { defaultClaimAlertState, IClaimAlertState } from './claim-alert.state';

describe('claimAlertReducer', () => {
  it('reduces SET_CLAIM_ALERT action', () => {
    const action = setClaimAlertAction(
      claimAlertMock.prescribedMedication,
      claimAlertMock.alternativeMedicationList
    );

    const initialState: IClaimAlertState = {
      ...defaultClaimAlertState,
    };
    const reducedState = claimAlertReducer(initialState, action);

    const expectedState: IClaimAlertState = {
      ...initialState,
      prescribedMedication: claimAlertMock.prescribedMedication,
      alternativeMedicationList: claimAlertMock.alternativeMedicationList,
    };
    expect(reducedState).toEqual(expectedState);
  });
});
