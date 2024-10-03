// Copyright 2021 Prescryptive Health, Inc.

import { pastProceduresListMock } from '../../../__mocks__/past-procedures.mock';
import { pastProceduresSetAction } from './past-procedures-set.action';

describe('pastProceduresSetAction', () => {
  it('returns action', () => {
    const action = pastProceduresSetAction(pastProceduresListMock);

    expect(action.type).toEqual('PAST_PROCEDURES_LIST_RESPONSE');
    expect(action.payload).toEqual({
      pastProceduresList: pastProceduresListMock,
    });
  });
});
