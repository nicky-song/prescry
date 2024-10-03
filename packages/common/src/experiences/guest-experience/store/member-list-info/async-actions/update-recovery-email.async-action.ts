// Copyright 2021 Prescryptive Health, Inc.

import { IUpdateRecoveryEmailRequestBody } from '../../../../../models/api-request-body/update-recovery-email.request-body';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { getMemberInfoDispatch } from '../dispatch/get-member-info.dispatch';
import { updateRecoveryEmailDispatch } from '../dispatch/update-recovery-email.dispatch';
import { IDispatchContactInfoActionsType } from '../member-list-info-reducer.actions';

export type IUpdateRecoveryEmailActionType =
  IDispatchPostLoginApiErrorActionsType;

export interface IUpdateRecoveryEmailAsyncActionProps {
  requestBody: IUpdateRecoveryEmailRequestBody;
  navigation: RootStackNavigationProp;
}

export const updateRecoveryEmailAsyncAction = (
  props: IUpdateRecoveryEmailAsyncActionProps
) => {
  return async (
    dispatch: (
      action: IUpdateRecoveryEmailActionType | IDispatchContactInfoActionsType
    ) => RootState,
    getState: () => RootState
  ) => {
    try {
      await updateRecoveryEmailDispatch(
        dispatch,
        getState,
        props.navigation,
        props.requestBody
      );
      await getMemberInfoDispatch(dispatch, getState);
      return true;
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        props.navigation
      );
      return false;
    }
  };
};
