// Copyright 2021 Prescryptive Health, Inc.

import { sendVerificationCodeDispatch } from '../dispatch/send-verification-code.dispatch';
import { IVerificationCodeAsyncActionArgs } from './send-verification-code.async-action';

export const resendVerificationCodeAsyncAction = (
  props: IVerificationCodeAsyncActionArgs
) => {
  return async () => {
    await sendVerificationCodeDispatch(
      props.reduxDispatch,
      props.reduxGetState,
      props.navigation,
      props.verificationType,
      true
    );
  };
};
