// Copyright 2018 Prescryptive Health, Inc.

import { IPrescribedMemberState } from './prescribed-member-reducer';
import {
  PrescribedMemberActionKeys,
  setPrescribedMemberDetailsAction,
} from './prescribed-member-reducer.actions';

describe('setPrescribedMemberDetailsAction', () => {
  it('should issue SET_PRESCRIBED_MEMBER_DETAILS action ', () => {
    const prescribedMember: IPrescribedMemberState = {
      firstName: 'fake firstName',
      identifier: 'fake identifier',
      isPrimary: true,
      lastName: 'fake lastName',
    };
    expect(setPrescribedMemberDetailsAction(prescribedMember)).toMatchObject({
      payload: prescribedMember,
      type: PrescribedMemberActionKeys.SET_PRESCRIBED_MEMBER_DETAILS,
    });
  });
});
