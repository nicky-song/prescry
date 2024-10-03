// Copyright 2018 Prescryptive Health, Inc.

import {
  MemberListInfoActionKeys,
  setMembersInfoAction,
} from './member-list-info-reducer.actions';
import { IMemberContactInfo } from '../../../../models/member-info/member-contact-info';

describe('setMembersInfoAction', () => {
  it('should issue SET_MEMBER_LIST_INFO action ', () => {
    const adultMembers: IMemberContactInfo[] = [{ rxGroupType: 'CASH' }];
    const childMembers: IMemberContactInfo[] = [{ rxGroupType: 'CASH' }];
    const loggedInMember = {
      rxGroupType: 'SIE',
    } as IMemberContactInfo;
    const isMember = true;

    const action = setMembersInfoAction(
      loggedInMember,
      childMembers,
      adultMembers,
      isMember
    );
    expect(action).toMatchObject({
      payload: {
        adultMembers,
        childMembers,
        loggedInMember,
      },
      type: MemberListInfoActionKeys.SET_MEMBER_LIST_INFO,
    });
  });
});
