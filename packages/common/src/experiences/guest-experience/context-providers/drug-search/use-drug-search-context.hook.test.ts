// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useDrugSearchContext } from './use-drug-search-context.hook';
import { IDrugSearchContext } from './drug-search.context';
import { defaultDrugSearchState } from '../../state/drug-search/drug-search.state';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useDrugSearchContext', () => {
  it('returns expected context', () => {
    const contextMock: IDrugSearchContext = {
      drugSearchState: defaultDrugSearchState,
      drugSearchDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IDrugSearchContext = useDrugSearchContext();
    expect(context).toEqual(contextMock);
  });
});
