// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { resendVerificationCodeAsyncAction } from './resend-verification-code.async-action';
import { IVerificationCodeAsyncActionArgs } from './send-verification-code.async-action';

export const resendVerificationCodeDataLoadingAsyncAction = async (
  props: IVerificationCodeAsyncActionArgs
) => {
  await dataLoadingAction(resendVerificationCodeAsyncAction, props)(
    props.reduxDispatch,
    props.reduxGetState
  );
};
