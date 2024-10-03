// Copyright 2022 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { Dispatch } from 'react';
import { getAccumulatorsDispatch } from '../dispatch/get-accumulators.dispatch';
import { MedicineCabinetDispatch } from '../dispatch/medicine-cabinet.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export interface IGetAccumulatorAsyncActionArgs extends IAsyncActionArgs {
  medicineCabinetDispatch: MedicineCabinetDispatch;
  navigation: RootStackNavigationProp;
}

export const getAccumulatorsAsyncAction = async (
  args: IGetAccumulatorAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

const asyncAction = (args: IGetAccumulatorAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<IDispatchPostLoginApiErrorActionsType>
  ) => {
    try {
      await getAccumulatorsDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
