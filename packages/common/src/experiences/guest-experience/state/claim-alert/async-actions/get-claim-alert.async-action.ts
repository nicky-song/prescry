// Copyright 2022 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { ClaimAlertDispatch } from '../dispatch/claim-alert.dispatch';
import { getClaimAlertDispatch } from '../dispatch/get-claim-alert.dispatch';

export interface IGetClaimAlertAsyncActionArgs extends IAsyncActionArgs {
  identifier: string;
  claimAlertDispatch: ClaimAlertDispatch;
  navigation: RootStackNavigationProp;
}

export const getClaimAlertAsyncAction = async (
  args: IGetClaimAlertAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

const asyncAction = (args: IGetClaimAlertAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<IDispatchPostLoginApiErrorActionsType>
  ) => {
    try {
      await getClaimAlertDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
