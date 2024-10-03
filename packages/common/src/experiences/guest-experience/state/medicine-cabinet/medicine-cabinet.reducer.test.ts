// Copyright 2021 Prescryptive Health, Inc.

import {
  accumulatorsMock,
  medicineCabinetStateMock,
} from '../../__mocks__/medicine-cabinet-state.mock';
import { setMedicineCabinetPrescriptionsAction } from './actions/set-medicine-cabinet-prescriptions.action';
import { setMoreMedicineCabinetPrescriptionsAction } from './actions/set-more-medicine-cabinet-prescriptions.action';
import { setAccumulatorsAction } from './actions/set-accumulators.action';
import { MedicineCabinetReducer } from './medicine-cabinet.reducer';
import {
  IMedicineCabinetState,
  defaultMedicineCabinetState,
} from './medicine-cabinet.state';

describe('MedicineCabinetReducer', () => {
  it('reduces SET_MEDICINE_CABINET_PRESCRIPTIONS action', () => {
    const action = setMedicineCabinetPrescriptionsAction(
      medicineCabinetStateMock.prescriptions
    );

    const initialState: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
    };
    const reducedState = MedicineCabinetReducer(initialState, action);

    const expectedState: IMedicineCabinetState = {
      ...initialState,
      prescriptions: medicineCabinetStateMock.prescriptions,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces SET_MORE_MEDICINE_CABINET_PRESCRIPTIONS action', () => {
    const action = setMoreMedicineCabinetPrescriptionsAction(
      medicineCabinetStateMock.prescriptions
    );

    const initialState: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
    };
    const reducedState = MedicineCabinetReducer(initialState, action);

    const expectedState: IMedicineCabinetState = {
      ...initialState,
      prescriptions: medicineCabinetStateMock.prescriptions,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces SET_ACCUMULATORS action', () => {
    const action = setAccumulatorsAction(accumulatorsMock);

    const initialState: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
    };
    const reducedState = MedicineCabinetReducer(initialState, action);

    const expectedState: IMedicineCabinetState = {
      ...initialState,
      accumulators: accumulatorsMock,
    };
    expect(reducedState).toEqual(expectedState);
  });
});
