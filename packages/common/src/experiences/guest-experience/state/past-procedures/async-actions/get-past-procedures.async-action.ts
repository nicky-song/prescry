// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { IAsyncActionArgs } from '../../async-action-args';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { PastProceduresDispatch } from '../dispatch/past-procedures.dispatch';
import { getPastProceduresListDispatch } from '../dispatch/get-past-procedures-list.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type IGetPastProceduresActionType =
  IDispatchPostLoginApiErrorActionsType;

export interface IGetPastProceduresListAsyncActionArgs
  extends IAsyncActionArgs {
  navigation: RootStackNavigationProp;
  pastProceduresDispatch: PastProceduresDispatch;
}

export const getPastProceduresAsyncAction = async (
  args: IGetPastProceduresListAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

const asyncAction = (args: IGetPastProceduresListAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<IGetPastProceduresActionType>
  ) => {
    try {
      await getPastProceduresListDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
