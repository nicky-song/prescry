// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import {
  IVerificationCodeAsyncActionArgs,
  sendVerificationCodeAsyncAction,
} from './send-verification-code.async-action';

export const sendVerificationCodeDataLoadingAsyncAction = async (
  args: IVerificationCodeAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(sendVerificationCodeAsyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};
