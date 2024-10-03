// Copyright 2021 Prescryptive Health, Inc.

import { medicineCabinetStateMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { setMedicineCabinetPrescriptionsAction } from '../actions/set-medicine-cabinet-prescriptions.action';
import { setMedicineCabinetPrescriptionsDispatch } from './set-medicine-cabinet-prescriptions.dispatch';

describe('setMedicineCabinetPrescriptionsDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setMedicineCabinetPrescriptionsDispatch(
      dispatchMock,
      medicineCabinetStateMock.prescriptions
    );

    const expectedAction = setMedicineCabinetPrescriptionsAction(
      medicineCabinetStateMock.prescriptions
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
