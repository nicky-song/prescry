// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import {
  saveUpdatedMemberContactInfoAction,
  setEditMemberProfileErrorAction,
} from '../store/edit-member-profile/edit-member-profile-reducer.actions';
import { RootState } from '../store/root-reducer';
import {
  EditMemberProfileScreen,
  IEditMemberProfileScreenActionProps,
  IEditMemberProfileScreenProps,
} from './edit-member-profile-screen';

export const mapStateToProps = (
  state: RootState
): IEditMemberProfileScreenProps => {
  const { isAdult, memberInfo, secondaryUser } = state.editMemberProfile;

  return {
    isAdult,
    memberInfo,
    secondaryUser,
  };
};

export const mapDispatchToProps: IEditMemberProfileScreenActionProps = {
  saveMemberContactInfo: saveUpdatedMemberContactInfoAction,
  setErrorMessage: setEditMemberProfileErrorAction,
};

export const EditMemberProfileScreenConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMemberProfileScreen);
