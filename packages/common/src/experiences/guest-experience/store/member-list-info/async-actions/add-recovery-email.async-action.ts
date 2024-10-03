// Copyright 2021 Prescryptive Health, Inc.

import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { addRecoveryEmailDispatch } from '../dispatch/add-recovery-email.dispatch';
import { IDispatchContactInfoActionsType } from '../member-list-info-reducer.actions';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';

export type IAddRecoveryEmailActionType = IDispatchPostLoginApiErrorActionsType;

export interface IAddRecoveryEmailAsyncAction {
  email: string;
  navigation: RootStackNavigationProp;
}

export const addRecoveryEmailAsyncAction = (
  args: IAddRecoveryEmailAsyncAction
) => {
  return async (
    dispatch: (
      action: IAddRecoveryEmailActionType | IDispatchContactInfoActionsType
    ) => RootState,
    getState: () => RootState
  ) => {
    try {
      await addRecoveryEmailDispatch(dispatch, getState, args.navigation, {
        email: args.email,
      });
      return true;
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
      return false;
    }
  };
};
