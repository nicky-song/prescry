// Copyright 2022 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { IAsyncActionArgs } from '../../../state/async-action-args';
import { ICreateAccount } from '../../../../../models/create-account';
import { verifyPrescriptionDispatch } from '../../prescription-verification/dispatch/verify-prescription.dispatch';
import { Workflow } from '../../../../../models/workflow';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type ICreateAccountWithOptionalPhoneNumber = Omit<
  ICreateAccount,
  'phoneNumber'
> & { phoneNumber?: string };
export interface IVerifyPrescriptionAsyncActionArgs extends IAsyncActionArgs {
  account: ICreateAccountWithOptionalPhoneNumber;
  workflow: Workflow;
  navigation: RootStackNavigationProp;
  blockchain?: boolean;
}

export const verifyPrescriptionAsyncAction = async (
  args: IVerifyPrescriptionAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

const asyncAction = (args: IVerifyPrescriptionAsyncActionArgs) => {
  return async () => {
    await verifyPrescriptionDispatch(args);
  };
};
