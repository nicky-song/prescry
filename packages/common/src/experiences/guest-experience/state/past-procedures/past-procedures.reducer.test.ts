// Copyright 2021 Prescryptive Health, Inc.

import { pastProceduresListMock } from '../../__mocks__/past-procedures.mock';
import { pastProceduresSetAction } from './actions/past-procedures-set.action';
import { pastProceduresReducer } from './past-procedures.reducer';
import {
  defaultPastProceduresState,
  IPastProceduresListState,
} from './past-procedures.state';

describe('pastProceduresReducer', () => {
  it('reduces past prodecures set action', () => {
    const action = pastProceduresSetAction(pastProceduresListMock);

    const initialState: IPastProceduresListState = {
      ...defaultPastProceduresState,
    };
    const reducedState = pastProceduresReducer(initialState, action);

    const expectedState: IPastProceduresListState = {
      ...initialState,
      pastProceduresList: pastProceduresListMock,
    };
    expect(reducedState).toEqual(expectedState);
  });
});
