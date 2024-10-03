// Copyright 2021 Prescryptive Health, Inc.

import { medicineCabinetStateMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { setMoreMedicineCabinetPrescriptionsAction } from '../actions/set-more-medicine-cabinet-prescriptions.action';
import { setMoreMedicineCabinetPrescriptionsDispatch } from './set-more-medicine-cabinet-prescriptions.dispatch';

describe('setMedicineCabinetPrescriptionsDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setMoreMedicineCabinetPrescriptionsDispatch(
      dispatchMock,
      medicineCabinetStateMock.prescriptions
    );

    const expectedAction = setMoreMedicineCabinetPrescriptionsAction(
      medicineCabinetStateMock.prescriptions
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
