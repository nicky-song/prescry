// Copyright 2022 Prescryptive Health, Inc.

import { IAccumulators } from '../../../../../models/accumulators';
import { setAccumulatorsAction } from '../actions/set-accumulators.action';
import { MedicineCabinetDispatch } from './medicine-cabinet.dispatch';

export const setAccumulatorsDispatch = (
  dispatch: MedicineCabinetDispatch,
  accumulators: IAccumulators
): void => {
  dispatch(setAccumulatorsAction(accumulators));
};
