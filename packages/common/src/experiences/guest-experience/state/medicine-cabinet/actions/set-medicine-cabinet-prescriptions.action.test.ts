// Copyright 2021 Prescryptive Health, Inc.

import { medicineCabinetStateMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { setMedicineCabinetPrescriptionsAction } from './set-medicine-cabinet-prescriptions.action';

describe('setMedicineCabinetPrescriptionsAction', () => {
  it('returns action', () => {
    const action = setMedicineCabinetPrescriptionsAction(
      medicineCabinetStateMock.prescriptions
    );
    expect(action.type).toEqual('SET_MEDICINE_CABINET_PRESCRIPTIONS');

    expect(action.payload).toEqual({
      prescriptions: medicineCabinetStateMock.prescriptions,
    });
  });
});
