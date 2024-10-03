// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { RootState } from '../../root-reducer';
import { IMemberLoginState } from '../member-login-reducer';
import { dispatchLoginUserResponse } from '../member-login-reducer.actions';
import { addMembershipDispatch } from '../../add-membership/dispatch/add-membership.dispatch';
import { IMemberAddOrLoginActionType } from '../async-actions/member-add-or-login.async.action';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const memberAddOrLoginDispatch = async (
  dispatch: Dispatch<IMemberAddOrLoginActionType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  memberLoginInfo: IMemberLoginState
) => {
  const state = getState();

  if (state.settings.token) {
    await addMembershipDispatch(
      dispatch,
      getState,
      navigation,
      memberLoginInfo
    );
  } else {
    await dispatchLoginUserResponse(
      dispatch,
      getState,
      navigation,
      memberLoginInfo
    );
  }
};
