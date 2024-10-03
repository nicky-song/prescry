// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { Workflow } from '../../../../../models/workflow';
import { ILoginRequestBody } from '../../../../../models/api-request-body/login.request-body';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';
import { IAsyncActionArgs } from '../../../state/async-action-args';
import { ISetMissingAccountErrorMessageAction } from '../../support-error/support-error.reducer.actions';
import { createAccountWithDeviceTokenDispatch } from '../dispatch/create-account-with-device-token.dispatch';

export interface ICreateAccountDeviceTokenAsyncActionArgs
  extends IAsyncActionArgs {
  account: ILoginRequestBody;
  workflow: Workflow;
  navigation: RootStackNavigationProp;
}

export const createAccountDeviceTokenAsyncAction = async (
  args: ICreateAccountDeviceTokenAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

export type ICreateAccountWithDeviceTokenActionType =
  ISetMissingAccountErrorMessageAction;

const asyncAction = (args: ICreateAccountDeviceTokenAsyncActionArgs) => {
  return async () => {
    await createAccountWithDeviceTokenDispatch(args);
  };
};
