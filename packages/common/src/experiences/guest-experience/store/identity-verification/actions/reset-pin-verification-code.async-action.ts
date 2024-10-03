// Copyright 2021 Prescryptive Health, Inc.

import { IResetPinRequestBody } from '../../../../../models/api-request-body/reset-pin.request-body';
import {
  resetPinDispatch,
  ResetPinDispatchType,
} from '../dispatch/reset-pin.dispatch';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';
import { IAsyncActionArgs } from '../../../state/async-action-args';

export type IResetPinVerificationCodeActionType = ResetPinDispatchType;

export interface IResetPinVerificationCodeAsyncActionArgs
  extends IAsyncActionArgs {
  navigation: RootStackNavigationProp;
  requestBody: IResetPinRequestBody;
}

export const resetPinVerificationCodeAsyncAction = (
  args: IResetPinVerificationCodeAsyncActionArgs
) => {
  return async () => {
    await resetPinDispatch(
      args.reduxDispatch,
      args.reduxGetState,
      args.navigation,
      args.requestBody
    );
    return true;
  };
};
