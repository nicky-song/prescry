// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { ICreateAccount } from '../../../../../models/create-account';
import { Workflow } from '../../../../../models/workflow';
import { handleTwilioErrorAction } from '../../../store/error-handling.actions';
import { internalErrorDispatch } from '../../../store/error-handling/dispatch/internal-error.dispatch';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { IAsyncActionArgs } from '../../async-action-args';
import { sendOneTimeVerificationCodeDispatch } from '../../../store/navigation/dispatch/sign-in/send-one-time-verification-code.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export interface ISendOneTimeVerificationCodeAsyncActionArgs
  extends IAsyncActionArgs {
  account: ICreateAccount;
  workflow: Workflow;
  navigation: RootStackNavigationProp;
}

export const sendOneTimeVerificationCodeAsyncAction = async (
  args: ISendOneTimeVerificationCodeAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

const asyncAction = (args: ISendOneTimeVerificationCodeAsyncActionArgs) => {
  return async () => {
    const { account, workflow, reduxDispatch, reduxGetState, navigation } =
      args;

    try {
      await sendOneTimeVerificationCodeDispatch(
        account,
        workflow,
        reduxGetState,
        navigation
      );
    } catch (error) {
      if (error instanceof ErrorBadRequest) {
        throw error;
      }

      if (error instanceof TooManyRequestError) {
        handleTwilioErrorAction(reduxDispatch, navigation, error.message);
      } else {
        internalErrorDispatch(navigation, error as Error);
      }
    }
  };
};
