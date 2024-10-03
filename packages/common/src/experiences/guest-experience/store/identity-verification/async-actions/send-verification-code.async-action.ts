// Copyright 2021 Prescryptive Health, Inc.

import { VerificationTypes } from '../../../../../models/api-request-body/send-verification-code.request-body';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IAsyncActionArgs } from '../../../state/async-action-args';
import { setIdentityVerificationMethodAction } from '../actions/set-identity-verification-method.action';
import { sendVerificationCodeDispatch } from '../dispatch/send-verification-code.dispatch';

export interface IVerificationCodeAsyncActionArgs extends IAsyncActionArgs {
  navigation: RootStackNavigationProp;
  verificationType: VerificationTypes;
}

export const sendVerificationCodeAsyncAction = (
  props: IVerificationCodeAsyncActionArgs
) => {
  return async () => {
    props.reduxDispatch(
      setIdentityVerificationMethodAction({
        selectedVerificationMethod: props.verificationType,
      })
    );
    await sendVerificationCodeDispatch(
      props.reduxDispatch,
      props.reduxGetState,
      props.navigation,
      props.verificationType
    );
  };
};
