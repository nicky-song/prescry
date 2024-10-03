// Copyright 2021 Prescryptive Health, Inc.

import { IPastProcedure } from '../../../../models/api-response/past-procedure-response';

export interface IPastProceduresListState {
  pastProceduresList: IPastProcedure[];
}

export const defaultPastProceduresState: IPastProceduresListState = {
  pastProceduresList: [],
};
