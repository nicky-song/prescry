// Copyright 2022 Prescryptive Health, Inc.

import { claimAlertMock } from '../../../__mocks__/claim-alert.mock';
import { IClaimAlertState } from '../claim-alert.state';
import { setClaimAlertAction } from './set-claim-alert.action';

describe('setClaimAlertAction', () => {
  it('returns action', () => {
    const action = setClaimAlertAction(
      claimAlertMock.prescribedMedication,
      claimAlertMock.alternativeMedicationList,
      claimAlertMock.pharmacyInfo,
      claimAlertMock.notificationType,
      claimAlertMock.prescriber
    );

    expect(action.type).toEqual('SET_CLAIM_ALERT');

    const {
      prescribedMedication,
      alternativeMedicationList,
      pharmacyInfo,
      notificationType,
      prescriber,
    } = claimAlertMock;

    expect(action.payload).toEqual({
      prescribedMedication,
      alternativeMedicationList,
      pharmacyInfo,
      notificationType,
      prescriber,
    } as IClaimAlertState);
  });
});
