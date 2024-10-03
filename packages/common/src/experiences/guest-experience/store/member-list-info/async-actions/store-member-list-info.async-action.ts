// Copyright 2018 Prescryptive Health, Inc.

import { getHighestPriorityProfile } from '../../../../../utils/profile.helper';
import { ISetMemberProfileAction } from '../../member-profile/actions/set-member-profile.action';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { updateCurrentMembersInfoDispatch } from '../dispatch/update-current-members-info.dispatch';
import { updateSecondaryMembersInfoDispatch } from '../dispatch/update-secondary-members-info.dispatch';

export const storeMemberListInfoAsyncAction = () => {
  return (
    dispatch: Dispatch<ISetMemberProfileAction>,
    getState: () => RootState
  ) => {
    const state = getState();

    const highestPriorityProfile = getHighestPriorityProfile(
      state.memberProfile.profileList
    );

    const identifier = state.editMemberProfile.memberInfo.identifier;

    const isPrimaryProfile =
      highestPriorityProfile?.primary.identifier === identifier;

    if (isPrimaryProfile) {
      return updateCurrentMembersInfoDispatch(dispatch, getState);
    }

    return updateSecondaryMembersInfoDispatch(dispatch, getState);
  };
};
