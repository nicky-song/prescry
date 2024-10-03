// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { SessionDispatch } from '../../state/session/dispatch/session.dispatch';
import {
  defaultSessionState,
  ISessionState,
} from '../../state/session/session.state';

export interface ISessionContext {
  readonly sessionState: ISessionState;
  readonly sessionDispatch: SessionDispatch;
}

export const SessionContext = createContext<ISessionContext>({
  sessionState: defaultSessionState,
  sessionDispatch: () => {
    return;
  },
});
