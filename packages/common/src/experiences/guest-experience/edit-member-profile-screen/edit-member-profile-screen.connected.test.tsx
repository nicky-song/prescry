// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import { assertIsDefined } from '../../../assertions/assert-is-defined';
import {
  IDependentProfile,
  IPrimaryProfile,
} from '../../../models/member-profile/member-profile-info';
import {
  saveUpdatedMemberContactInfoAction,
  setEditMemberProfileErrorAction,
} from '../store/edit-member-profile/edit-member-profile-reducer.actions';
import { RootState } from '../store/root-reducer';
import {
  IEditMemberProfileScreenActionProps,
  IEditMemberProfileScreenProps,
} from './edit-member-profile-screen';
import {
  EditMemberProfileScreenConnected,
  mapStateToProps,
} from './edit-member-profile-screen.connected';

jest.mock('./edit-member-profile-screen', () => ({
  EditMemberProfileScreen: () => <div />,
}));
jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

const connectMock = connect as unknown as jest.Mock;

describe('EditMemberProfileScreenConnected mapStateToProps', () => {
  it('should call connect with mapStateToProps', () => {
    expect(connectMock.mock.calls[0][0]).toBe(mapStateToProps);
  });

  it('maps properties', () => {
    const initialStateMock: Partial<RootState> = {
      editMemberProfile: {
        isAdult: true,
        memberInfo: {
          firstName: 'first',
          lastName: 'last',
        } as IPrimaryProfile,
        secondaryUser: {
          firstName: 'secondary-first-name',
          lastName: 'secondary-last-name',
        } as IDependentProfile,
      },
    };

    const result = mapStateToProps(initialStateMock as RootState);

    assertIsDefined(initialStateMock.editMemberProfile);
    const expectedResult: IEditMemberProfileScreenProps = {
      isAdult: initialStateMock.editMemberProfile.isAdult,
      memberInfo: initialStateMock.editMemberProfile.memberInfo,
      secondaryUser: initialStateMock.editMemberProfile.secondaryUser,
    };
    expect(result).toEqual(expectedResult);
  });
});

describe('EditMemberProfileScreenConnected actions', () => {
  it('should be defined ConnectedEditMemberProfileScreen', () => {
    expect(EditMemberProfileScreenConnected).toBeDefined();
  });

  it('should have been called the connectMock', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('should assign proper actions', () => {
    const expectedActions: IEditMemberProfileScreenActionProps = {
      saveMemberContactInfo: saveUpdatedMemberContactInfoAction,
      setErrorMessage: setEditMemberProfileErrorAction,
    };

    expect(connectMock.mock.calls[0][1]).toEqual(expectedActions);
  });
});
