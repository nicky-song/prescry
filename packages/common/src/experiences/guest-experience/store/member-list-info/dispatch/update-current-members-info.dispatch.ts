// Copyright 2018 Prescryptive Health, Inc.

import { IProfile } from '../../../../../models/member-profile/member-profile-info';
import {
  ISetMemberProfileAction,
  setMemberProfileAction,
} from '../../member-profile/actions/set-member-profile.action';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';

export const updateCurrentMembersInfoDispatch = (
  dispatch: Dispatch<ISetMemberProfileAction>,
  getState: () => RootState
) => {
  const state = getState();

  const existingMemberProfile = JSON.parse(JSON.stringify(state.memberProfile));
  const { secondaryUser, memberInfo } = state.editMemberProfile;
  const secondaryAlertCarbonCopyIdentifier =
    secondaryUser && secondaryUser.identifier;

  existingMemberProfile.profileList.every((profile: IProfile) => {
    if (
      profile.rxGroupType === 'SIE' &&
      profile.primary.identifier === memberInfo.identifier
    ) {
      profile.primary.secondaryAlertCarbonCopyIdentifier =
        secondaryAlertCarbonCopyIdentifier;
      return false;
    }
    return true;
  });

  return dispatch(
    setMemberProfileAction({
      account: existingMemberProfile.account,
      profileList: existingMemberProfile.profileList,
    })
  );
};
