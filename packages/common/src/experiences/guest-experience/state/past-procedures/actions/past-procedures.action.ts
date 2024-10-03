// Copyright 2021 Prescryptive Health, Inc.

import { IPastProceduresListState } from '../past-procedures.state';

export type PastProceduresActionKeys = 'PAST_PROCEDURES_LIST_RESPONSE';

export interface IPastProceduresListAction<T extends PastProceduresActionKeys> {
  readonly type: T;
  readonly payload: Partial<IPastProceduresListState>;
}

export type PastProceduresAction = IPastProceduresListAction<
  PastProceduresActionKeys
>;
