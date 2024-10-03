// Copyright 2018 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import {
  ISetSelectedMemberAction,
  setSelectedMemberAction,
} from '../edit-member-profile-reducer.actions';
import {
  IDependentProfile,
  IPrimaryProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const editMemberProfileScreenDispatch = (
  dispatch: Dispatch<ISetSelectedMemberAction>,
  navigation: RootStackNavigationProp,
  memberInfo: IPrimaryProfile | IDependentProfile,
  isAdult?: boolean,
  secondaryUser?: IDependentProfile
) => {
  dispatch(
    setSelectedMemberAction({
      isAdult,
      memberInfo,
      secondaryUser,
    })
  );

  navigation.navigate('EditMemberProfile');
};
