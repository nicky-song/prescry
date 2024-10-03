// Copyright 2022 Prescryptive Health, Inc.

import { setClaimAlertAction } from '../actions/set-claim-alert.action';
import { setClaimAlertDispatch } from './set-claim-alert.dispatch';
import { claimAlertMock } from '../../../__mocks__/claim-alert.mock';
import { IClaimAlertState } from '../claim-alert.state';

jest.mock('../actions/set-claim-alert.action');
const setClaimAlertActionMock = setClaimAlertAction as jest.Mock;

describe('setClaimAlertDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setClaimAlertDispatch(
      dispatchMock,
      claimAlertMock.prescribedMedication,
      claimAlertMock.alternativeMedicationList,
      claimAlertMock.pharmacyInfo,
      claimAlertMock.notificationType,
      claimAlertMock.prescriber
    );
    const expectedAction = setClaimAlertActionMock({
      ...claimAlertMock,
    } as IClaimAlertState);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
