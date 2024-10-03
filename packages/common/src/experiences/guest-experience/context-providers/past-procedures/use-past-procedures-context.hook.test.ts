// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { defaultPastProceduresState } from '../../state/past-procedures/past-procedures.state';
import { IPastProceduresContext } from './past-procedures.context';
import { usePastProceduresContext } from './use-past-procedures-context.hook';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('usePastProceduresContext', () => {
  it('returns expected context', () => {
    const contextMock: IPastProceduresContext = {
      pastProceduresState: defaultPastProceduresState,
      pastProceduresDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IPastProceduresContext = usePastProceduresContext();
    expect(context).toEqual(contextMock);
  });
});
