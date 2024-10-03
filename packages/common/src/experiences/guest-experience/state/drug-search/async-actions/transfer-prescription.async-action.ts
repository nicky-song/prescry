// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { ITransferPrescriptionRequestBody } from '../../../../../models/api-request-body/transfer-prescription.request-body';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { transferPrescriptionDispatch } from '../dispatch/transfer-prescription.dispatch';

export type ITransferPrescriptionActionType =
  IDispatchPostLoginApiErrorActionsType;

export interface ITransferPrescriptionAsyncActionArgs extends IAsyncActionArgs {
  transferPrescriptionRequestBody: ITransferPrescriptionRequestBody;
  navigation: RootStackNavigationProp;
}

export const transferPrescriptionAsyncAction = async (
  args: ITransferPrescriptionAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

const asyncAction = (args: ITransferPrescriptionAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<ITransferPrescriptionActionType>
  ) => {
    try {
      await transferPrescriptionDispatch(args);
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
