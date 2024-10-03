// Copyright 2018 Prescryptive Health, Inc.

import {
  IDependentProfile,
  IProfile,
} from '../../../../../models/member-profile/member-profile-info';
import {
  ISetMemberProfileAction,
  setMemberProfileAction,
} from '../../member-profile/actions/set-member-profile.action';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';

export const updateSecondaryMembersInfoDispatch = (
  dispatch: Dispatch<ISetMemberProfileAction>,
  getState: () => RootState
) => {
  const state = getState();
  const existingMemberProfile = JSON.parse(JSON.stringify(state.memberProfile));
  const { memberInfo, secondaryUser } = state.editMemberProfile;

  const sieUserProfile = existingMemberProfile.profileList.find(
    (profile: IProfile) => profile.rxGroupType === 'SIE'
  );

  if (sieUserProfile && sieUserProfile.childMembers?.length) {
    sieUserProfile.childMembers.every((profile: IDependentProfile) => {
      if (profile.identifier === memberInfo.identifier) {
        profile.secondaryAlertChildCareTakerIdentifier =
          secondaryUser && secondaryUser.identifier;
        return false;
      }
      return true;
    });
  }
  return dispatch(
    setMemberProfileAction({
      account: existingMemberProfile.account,
      profileList: existingMemberProfile.profileList,
    })
  );
};
