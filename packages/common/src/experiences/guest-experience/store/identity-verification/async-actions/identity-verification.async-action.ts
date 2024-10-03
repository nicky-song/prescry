// Copyright 2021 Prescryptive Health, Inc.

import { IVerifyIdentityRequestBody } from '../../../../../models/api-request-body/verify-identity.request-body';
import {
  identityVerificationDispatch,
  IdentityVerificationDispatchType,
} from '../dispatch/identity-verification.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IAsyncActionArgs } from '../../../state/async-action-args';

export type IVerifyIdentityActionType = IdentityVerificationDispatchType;

export interface IIdentityVerificationAsyncActionArgs extends IAsyncActionArgs {
  navigation: RootStackNavigationProp;
  requestBody: IVerifyIdentityRequestBody;
}

export const identityVerificationAsyncAction = (
  props: IIdentityVerificationAsyncActionArgs
) => {
  return async () => {
    await identityVerificationDispatch(
      props.navigation,
      props.reduxDispatch,
      props.reduxGetState,
      props.requestBody
    );
  };
};
