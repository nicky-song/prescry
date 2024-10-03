// Copyright 2021 Prescryptive Health, Inc.

import { drugSearchResultsMock } from '../../../__mocks__/drug-search-response.mock';
import { setDrugSearchResultsAction } from '../actions/set-drug-search-results.action';
import { setDrugSearchResultsDispatch } from './set-drug-search-results.dispatch';

describe('setDrugSearchResultsDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setDrugSearchResultsDispatch(dispatchMock, drugSearchResultsMock, 0);

    const expectedAction = setDrugSearchResultsAction(drugSearchResultsMock, 0);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
