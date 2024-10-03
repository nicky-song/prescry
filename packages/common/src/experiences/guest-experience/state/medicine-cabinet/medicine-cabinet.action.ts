// Copyright 2021 Prescryptive Health, Inc.

import { IMedicineCabinetState } from './medicine-cabinet.state';

type ActionKeys =
  | 'SET_MEDICINE_CABINET_PRESCRIPTIONS'
  | 'SET_MORE_MEDICINE_CABINET_PRESCRIPTIONS'
  | 'SET_CLAIM_HISTORY'
  | 'SET_ACCUMULATORS';

export interface IMedicineCabinetAction<T extends ActionKeys> {
  readonly type: T;
  readonly payload: Partial<IMedicineCabinetState>;
}

export type MedicineCabinetAction = IMedicineCabinetAction<ActionKeys>;
