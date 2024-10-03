// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { IVerifyMembershipRequestBody } from '../../../../../models/api-request-body/verify-membership.request-body';
import { verifyMembershipDispatch } from '../../identity-verification/dispatch/verify-membership.dispatch';
import { IAsyncActionArgs } from '../../../state/async-action-args';
import { ICreateAccount } from '../../../../../models/create-account';
import { sendOneTimeVerificationCodeDispatch } from '../../navigation/dispatch/sign-in/send-one-time-verification-code.dispatch';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { handleTwilioErrorAction } from '../../error-handling.actions';
import { SmsNotSupportedError } from '../../../../../errors/sms-not-supported.error';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

type ICreateAccountWithRequiredMemberId = Omit<
  ICreateAccount,
  'primaryMemberRxId'
> & { primaryMemberRxId: string };

export interface ICreateMemberAccountAsyncActionArgs extends IAsyncActionArgs {
  navigation: RootStackNavigationProp;
  account: ICreateAccountWithRequiredMemberId;
}

export const createMemberAccountAsyncAction = async (
  args: ICreateMemberAccountAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

const asyncAction = (args: ICreateMemberAccountAsyncActionArgs) => {
  return async () => {
    const { reduxDispatch, reduxGetState, navigation } = args;
    const {
      dateOfBirth,
      email,
      firstName,
      lastName,
      phoneNumber,
      primaryMemberRxId,
      isBlockchain,
    } = args.account;

    const verifyMembershipArgs: IVerifyMembershipRequestBody = {
      dateOfBirth,
      email,
      firstName,
      lastName,
      phoneNumber,
      primaryMemberRxId,
      isBlockchain,
    };
    const isVerified = await verifyMembershipDispatch(
      reduxGetState,
      navigation,
      verifyMembershipArgs
    );

    if (isVerified) {
      try {
        await sendOneTimeVerificationCodeDispatch(
          args.account,
          'pbmActivate',
          reduxGetState,
          navigation
        );
      } catch (error) {
        if (error instanceof ErrorBadRequest) {
          throw new SmsNotSupportedError();
        }

        if (error instanceof TooManyRequestError) {
          handleTwilioErrorAction(reduxDispatch, navigation, error.message);
        } else {
          internalErrorDispatch(navigation, error as Error);
        }
      }
    }
  };
};
