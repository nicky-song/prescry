// Copyright 2023 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { Dispatch } from 'react';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { MembershipDispatch } from '../dispatch/membership.dispatch';
import { validateIdentityDispatch } from '../dispatch/validate-identity.dispatch';

export interface IValidateIdentityAsyncActionArgs extends IAsyncActionArgs {
  membershipDispatch: MembershipDispatch;
  smartContractAddress: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  navigation: RootStackNavigationProp;
}

export const validateIdentityAsyncAction = async (
  args: IValidateIdentityAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(
    asyncAction,
    args,
    true
  )(args.reduxDispatch, args.reduxGetState);
};

export type IValidateIdentityActionType = IDispatchPostLoginApiErrorActionsType;

const asyncAction = (args: IValidateIdentityAsyncActionArgs) => {
  return async (dispatch: Dispatch<IValidateIdentityActionType>) => {
    try {
      await validateIdentityDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
