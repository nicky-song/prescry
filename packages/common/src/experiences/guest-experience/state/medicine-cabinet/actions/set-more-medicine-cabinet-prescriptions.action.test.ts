// Copyright 2021 Prescryptive Health, Inc.

import { medicineCabinetStateMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { setMoreMedicineCabinetPrescriptionsAction } from './set-more-medicine-cabinet-prescriptions.action';

describe('setMoreMedicineCabinetPrescriptionsAction', () => {
  it('returns action', () => {
    const action = setMoreMedicineCabinetPrescriptionsAction(
      medicineCabinetStateMock.prescriptions
    );
    expect(action.type).toEqual('SET_MORE_MEDICINE_CABINET_PRESCRIPTIONS');

    expect(action.payload).toEqual({
      prescriptions: medicineCabinetStateMock.prescriptions,
    });
  });
});
