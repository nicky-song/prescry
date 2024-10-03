// Copyright 2020 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { memberAddOrLoginAsyncAction } from './member-add-or-login.async.action';
import { IMemberLoginState } from '../member-login-reducer';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const memberAddOrLoginDataLoadingAsyncAction = (
  navigation: RootStackNavigationProp,
  memberLoginInfo: IMemberLoginState
) =>
  dataLoadingAction(memberAddOrLoginAsyncAction, {
    navigation,
    memberLoginInfo,
  });
