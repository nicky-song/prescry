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
import { addConsentDispatch } from '../dispatch/add-consent.dispatch';

export interface IAddConsentAsyncActionArgs extends IAsyncActionArgs {
  membershipDispatch: MembershipDispatch;
  accountId: string;
  smartContractAddress: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  consent: boolean;
  navigation: RootStackNavigationProp;
}

export const addConsentAsyncAction = async (
  args: IAddConsentAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(
    asyncAction,
    args,
    true
  )(args.reduxDispatch, args.reduxGetState);
};

export type IAddConsentActionType = IDispatchPostLoginApiErrorActionsType;

const asyncAction = (args: IAddConsentAsyncActionArgs) => {
  return async (dispatch: Dispatch<IAddConsentActionType>) => {
    try {
      await addConsentDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
