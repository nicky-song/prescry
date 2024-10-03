// Copyright 2020 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { memberAddOrLoginDispatch } from '../dispatch/member-add-or-login.dispatch';
import { IMemberLoginState } from '../member-login-reducer';
import { IDispatchMemberLoginActionsType } from '../member-login-reducer.actions';
import { AddMembershipDispatchType } from '../../add-membership/dispatch/add-membership.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type IMemberAddOrLoginActionType =
  | IDispatchMemberLoginActionsType
  | AddMembershipDispatchType;

export interface IMemberAddOrLoginAsyncActionArgs {
  navigation: RootStackNavigationProp;
  memberLoginInfo: IMemberLoginState;
}

export const memberAddOrLoginAsyncAction = ({
  navigation,
  memberLoginInfo,
}: IMemberAddOrLoginAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<IMemberAddOrLoginActionType>,
    getState: () => RootState
  ) => {
    await memberAddOrLoginDispatch(
      dispatch,
      getState,
      navigation,
      memberLoginInfo
    );
  };
};
