// Copyright 2018 Prescryptive Health, Inc.

import {
  IDispatchContactInfoActionsType,
  MemberListInfoActionKeys,
} from '../member-list-info/member-list-info-reducer.actions';
import {
  DefaultContactInfoState,
  memberListInfoReducer,
} from './member-list-info-reducer';

describe('memberListInfoReducer', () => {
  it('should set member list info', () => {
    const action: IDispatchContactInfoActionsType = {
      payload: {
        adultMembers: [
          {
            firstName: 'fake-firstName',
            identifier: '1',
            lastName: 'fake-lastName',
            rxGroupType: 'COVID19',
          },
        ],
        childMembers: [
          {
            email: 'fake-email',
            firstName: 'fake-firstName',
            identifier: '2',
            lastName: 'fake-lastName',
            phoneNumber: 'fake-phoneNumber',
            primaryMemberRxId: 'fake-primaryMemberRxId',
            rxGroupType: 'COVID19',
          },
        ],
        loggedInMember: {
          carrierPCN: 'PH',
          email: 'fake-email',
          firstName: 'fake-firstName',
          identifier: '3',
          isPinEnabled: true,
          isPrimary: true,
          issuerNumber: '00007',
          lastName: 'fake-lastName',
          phoneNumber: 'fake-phoneNumber',
          primaryMemberFamilyId: 'fake-primaryMemberRxId',
          primaryMemberPersonCode: 'fake-primaryMemberRxId',
          primaryMemberRxId: 'fake-primaryMemberRxId',
          rxBin: '001',
          rxGroup: '007',
          rxGroupType: 'COVID19',
        },
        isMember: true,
      },
      type: MemberListInfoActionKeys.SET_MEMBER_LIST_INFO,
    };
    const state = memberListInfoReducer(DefaultContactInfoState, action);
    expect(state.loggedInMember).toEqual(action.payload.loggedInMember);
    expect(state.childMembers).toEqual(action.payload.childMembers);
    expect(state.adultMembers).toEqual(action.payload.adultMembers);
  });

  it('should return default state when state is not defined', () => {
    const action: IDispatchContactInfoActionsType = {
      payload: {},
      type: 'SET_MEMBER_PROFILE',
    };

    const result = memberListInfoReducer(undefined, action);
    expect(result).toEqual(DefaultContactInfoState);
  });
});
