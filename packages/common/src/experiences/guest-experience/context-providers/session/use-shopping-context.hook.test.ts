// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useSessionContext } from './use-session-context.hook';
import { ISessionContext } from './session.context';
import { defaultSessionState } from '../../state/session/session.state';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useSessionContext', () => {
  it('returns expected context', () => {
    const contextMock: ISessionContext = {
      sessionState: defaultSessionState,
      sessionDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: ISessionContext = useSessionContext();
    expect(context).toEqual(contextMock);
  });
});
