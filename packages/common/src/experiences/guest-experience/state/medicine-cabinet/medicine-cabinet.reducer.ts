// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { MedicineCabinetAction } from './medicine-cabinet.action';
import { IMedicineCabinetState } from './medicine-cabinet.state';

export type MedicineCabinetReducer = Reducer<
  IMedicineCabinetState,
  MedicineCabinetAction
>;

export const MedicineCabinetReducer: MedicineCabinetReducer = (
  state: IMedicineCabinetState,
  action: MedicineCabinetAction
): IMedicineCabinetState => {
  switch (action.type) {
    case 'SET_MEDICINE_CABINET_PRESCRIPTIONS':
      return {
        ...state,
        prescriptions: action.payload.prescriptions ?? [],
      };
    case 'SET_MORE_MEDICINE_CABINET_PRESCRIPTIONS':
      return {
        ...state,
        prescriptions: action.payload.prescriptions
          ? state.prescriptions.concat(action.payload.prescriptions)
          : state.prescriptions,
      };
    default:
      return { ...state, ...action.payload };
  }
};
