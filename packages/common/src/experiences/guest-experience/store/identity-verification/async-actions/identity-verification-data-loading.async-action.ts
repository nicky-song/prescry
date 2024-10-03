// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import {
  identityVerificationAsyncAction,
  IIdentityVerificationAsyncActionArgs,
} from './identity-verification.async-action';

export const identityVerificationDataLoadingAsyncAction = async (
  args: IIdentityVerificationAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(identityVerificationAsyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};
