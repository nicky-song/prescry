// Copyright 2018 Prescryptive Health, Inc.

import {
  DefaultPrescribedMemberState,
  prescribedMemberReducer,
} from './prescribed-member-reducer';
import {
  PrescribedMemberActionKeys,
  PrescribedMemberActionTypes,
} from './prescribed-member-reducer.actions';

describe('prescribedMemberReducer', () => {
  it('should set prescribed member details', () => {
    const action = {
      payload: {
        firstName: 'fake-firstName',
        identifier: 'fake-identifier',
        isPrimary: true,
        lastName: 'fake-lastName',
        rxGroupType: 'SIE',
      },
      type: PrescribedMemberActionKeys.SET_PRESCRIBED_MEMBER_DETAILS,
    } as PrescribedMemberActionTypes;
    const state = prescribedMemberReducer(undefined, action);
    expect(state).toEqual(action.payload);
  });

  it('should return default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as PrescribedMemberActionTypes;
    const result = prescribedMemberReducer(undefined, action);
    expect(result).toEqual(DefaultPrescribedMemberState);
  });
});
