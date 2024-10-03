// Copyright 2021 Prescryptive Health, Inc.

import { IPastProcedure } from '../../../../../models/api-response/past-procedure-response';
import { pastProceduresSetAction } from '../actions/past-procedures-set.action';
import { PastProceduresDispatch } from './past-procedures.dispatch';

export const setPastProceduresDispatch = (
  dispatch: PastProceduresDispatch,
  pastProceduresList: IPastProcedure[]
): void => {
  dispatch(pastProceduresSetAction(pastProceduresList));
};
