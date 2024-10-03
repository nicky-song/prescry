// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { ShoppingStackNavigationProp } from '../../../navigation/stack-navigators/shopping/shopping.stack-navigator';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { sendPrescriptionDispatch } from '../dispatch/send-prescription.dispatch';
import { ShoppingDispatch } from '../dispatch/shopping.dispatch';

export interface ISendPrescriptionAsyncActionArgs extends IAsyncActionArgs {
  ncpdp: string;
  prescriptionId: string;
  orderDate: Date;
  shoppingDispatch: ShoppingDispatch;
  navigation: ShoppingStackNavigationProp;
  blockchain?: boolean;
}

export const sendPrescriptionAsyncAction = async (
  args: ISendPrescriptionAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

export type ISendPrescriptionActionType = IDispatchPostLoginApiErrorActionsType;

const asyncAction = (args: ISendPrescriptionAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<ISendPrescriptionActionType>
  ) => {
    try {
      await sendPrescriptionDispatch(args);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
      throw error;
    }
  };
};
