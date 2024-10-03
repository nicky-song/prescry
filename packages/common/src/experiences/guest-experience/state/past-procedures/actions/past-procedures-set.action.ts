// Copyright 2021 Prescryptive Health, Inc.

import { IPastProcedure } from '../../../../../models/api-response/past-procedure-response';
import { IPastProceduresListAction } from './past-procedures.action';

export type IPastProceduresSetAction = IPastProceduresListAction<
  'PAST_PROCEDURES_LIST_RESPONSE'
>;

export const pastProceduresSetAction = (
  pastProceduresList: IPastProcedure[]
): IPastProceduresSetAction => ({
  type: 'PAST_PROCEDURES_LIST_RESPONSE',
  payload: { pastProceduresList },
});
