// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import {
  IResetPinVerificationCodeAsyncActionArgs,
  resetPinVerificationCodeAsyncAction,
} from './reset-pin-verification-code.async-action';

export const resetPinVerificationCodeDataLoadingAsyncAction = async (
  args: IResetPinVerificationCodeAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(resetPinVerificationCodeAsyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};
