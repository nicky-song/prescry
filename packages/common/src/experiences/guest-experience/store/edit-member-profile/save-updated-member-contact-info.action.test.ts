// Copyright 2018 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../modal-popup/modal-popup.reducer.actions';
import { IEditMemberProfileState } from './edit-member-profile-reducer';
import {
  IUpdatedMemberContactInfoActionArgs,
  saveUpdatedMemberContactInfoAction,
} from './edit-member-profile-reducer.actions';
import { updatedMemberContactInfoAction } from './edit-member-profile-reducer.actions';

jest.mock('../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));
const mockDataLoadingAction = dataLoadingAction as jest.Mock;

describe('saveUpdatedMemberContactInfoAction', () => {
  const mockMember: IEditMemberProfileState = {
    memberInfo: {
      email: 'fake_email',
      firstName: 'fake_firstName',
      lastName: 'fake_lastName',
      identifier: 'fake-identifier',
      phoneNumber: 'fake_phoneNumber',
      primaryMemberRxId: 'fake_primaryMemberRxId',
      rxGroupType: 'SIE',
      rxSubGroup: 'HMA01',
      dateOfBirth: '2000-01-01',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call dataLoadingAction with updatedMemberContactInfo and memberInfo', async () => {
    const editMemberProfileActions = jest.requireActual(
      './edit-member-profile-reducer.actions'
    );
    editMemberProfileActions.updatedMemberContactInfo = jest.fn();
    await saveUpdatedMemberContactInfoAction(
      rootStackNavigationMock,
      mockMember
    );

    expect(mockDataLoadingAction).toHaveBeenCalledTimes(1);

    const expectedArgs: IUpdatedMemberContactInfoActionArgs = {
      editMemberProfileState: mockMember,
      navigation: rootStackNavigationMock,
    };
    expect(mockDataLoadingAction).toHaveBeenNthCalledWith(
      1,
      updatedMemberContactInfoAction,
      expectedArgs
    );
  });
});
