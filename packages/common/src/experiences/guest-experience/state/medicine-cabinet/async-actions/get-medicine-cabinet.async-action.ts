// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { Dispatch } from 'react';
import { getMedicineCabinetDispatch } from '../dispatch/get-medicine-cabinet.dispatch';
import { MedicineCabinetDispatch } from '../dispatch/medicine-cabinet.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export interface IGetMedicineCabinetAsyncActionArgs extends IAsyncActionArgs {
  medicineCabinetDispatch: MedicineCabinetDispatch;
  page: number;
  navigation: RootStackNavigationProp;
  loadingText?: string;
}

export const getMedicineCabinetAsyncAction = async (
  args: IGetMedicineCabinetAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(
    asyncAction,
    args,
    true,
    args.loadingText
  )(args.reduxDispatch, args.reduxGetState);
};

export type IGetMedicineCabinetActionType =
  IDispatchPostLoginApiErrorActionsType;

const asyncAction = (args: IGetMedicineCabinetAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<IGetMedicineCabinetActionType>
  ) => {
    try {
      await getMedicineCabinetDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
