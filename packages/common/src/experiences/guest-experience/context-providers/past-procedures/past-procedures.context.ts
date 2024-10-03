// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { PastProceduresDispatch } from '../../state/past-procedures/dispatch/past-procedures.dispatch';
import {
  defaultPastProceduresState,
  IPastProceduresListState,
} from '../../state/past-procedures/past-procedures.state';

export interface IPastProceduresContext {
  readonly pastProceduresState: IPastProceduresListState;
  readonly pastProceduresDispatch: PastProceduresDispatch;
}

export const PastProceduresContext = createContext<IPastProceduresContext>({
  pastProceduresState: defaultPastProceduresState,
  pastProceduresDispatch: () => {
    return;
  },
});
