// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultDrugSearchState } from '../../state/drug-search/drug-search.state';
import { IDrugSearchContext, DrugSearchContext } from './drug-search.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('DrugSearchContext', () => {
  it('creates context', () => {
    expect(DrugSearchContext).toBeDefined();

    const expectedContext: IDrugSearchContext = {
      drugSearchState: defaultDrugSearchState,
      drugSearchDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
