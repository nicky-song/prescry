// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultPastProceduresState } from '../../state/past-procedures/past-procedures.state';
import {
  PastProceduresContext,
  IPastProceduresContext,
} from './past-procedures.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('PastProceduresContext', () => {
  it('creates context', () => {
    expect(PastProceduresContext).toBeDefined();

    const expectedContext: IPastProceduresContext = {
      pastProceduresState: defaultPastProceduresState,
      pastProceduresDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
