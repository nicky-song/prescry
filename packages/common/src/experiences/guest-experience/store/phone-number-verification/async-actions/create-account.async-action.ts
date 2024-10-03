// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import {
  createAccountDispatch,
  ICreateAccountActionType,
} from '../dispatch/create-account.dispatch';
import { ICreateAccount } from '../../../../../models/create-account';
import { Workflow } from '../../../../../models/workflow';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export interface ICreateAccountAsyncActionArgs {
  account: ICreateAccount;
  code: string;
  workflow: Workflow;
  navigation: RootStackNavigationProp;
}

export const createAccountAsyncAction = (args: ICreateAccountAsyncActionArgs) =>
  dataLoadingAction(asyncAction, args);

const asyncAction = (args: ICreateAccountAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<ICreateAccountActionType>,
    getState: () => RootState
  ): Promise<void> => {
    await createAccountDispatch(dispatch, getState, args);
  };
};
