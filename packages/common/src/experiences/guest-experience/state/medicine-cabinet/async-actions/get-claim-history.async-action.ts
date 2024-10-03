// Copyright 2022 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { Dispatch } from 'react';
import { MedicineCabinetDispatch } from '../dispatch/medicine-cabinet.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { getClaimHistoryDispatch } from '../dispatch/get-claim-history.dispatch';

export interface IGetClaimHistoryAsyncActionArgs extends IAsyncActionArgs {
  medicineCabinetDispatch: MedicineCabinetDispatch;
  navigation: RootStackNavigationProp;
  loadingText?: string;
}

export const getClaimHistoryAsyncAction = async (
  args: IGetClaimHistoryAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(
    asyncAction,
    args,
    true,
    args.loadingText
  )(args.reduxDispatch, args.reduxGetState);
};

const asyncAction = (args: IGetClaimHistoryAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<IDispatchPostLoginApiErrorActionsType>
  ) => {
    try {
      await getClaimHistoryDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
