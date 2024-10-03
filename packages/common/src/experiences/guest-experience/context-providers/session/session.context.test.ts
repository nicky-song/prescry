// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultSessionState } from '../../state/session/session.state';
import { ISessionContext, SessionContext } from './session.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('SessionContext', () => {
  it('creates context', () => {
    expect(SessionContext).toBeDefined();

    const expectedContext: ISessionContext = {
      sessionState: defaultSessionState,
      sessionDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
