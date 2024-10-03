// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { MedicineCabinetDispatch } from '../../state/medicine-cabinet/dispatch/medicine-cabinet.dispatch';
import {
  IMedicineCabinetState,
  defaultMedicineCabinetState,
} from '../../state/medicine-cabinet/medicine-cabinet.state';

export interface IMedicineCabinetContext {
  readonly medicineCabinetState: IMedicineCabinetState;
  readonly medicineCabinetDispatch: MedicineCabinetDispatch;
}

export const MedicineCabinetContext = createContext<IMedicineCabinetContext>({
  medicineCabinetState: defaultMedicineCabinetState,
  medicineCabinetDispatch: () => {
    return;
  },
});
