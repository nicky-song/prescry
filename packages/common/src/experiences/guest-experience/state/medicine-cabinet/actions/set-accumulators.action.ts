// Copyright 2022 Prescryptive Health, Inc.

import { IAccumulators } from '../../../../../models/accumulators';
import { IMedicineCabinetAction } from '../medicine-cabinet.action';

export type ISetAccumulatorsAction = IMedicineCabinetAction<'SET_ACCUMULATORS'>;

export const setAccumulatorsAction = (
  accumulators: IAccumulators
): ISetAccumulatorsAction => ({
  type: 'SET_ACCUMULATORS',
  payload: {
    accumulators,
  },
});
