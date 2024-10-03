// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { addRecoveryEmailAsyncAction } from './add-recovery-email.async-action';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';
import { IAddRecoveryEmailAsyncAction } from './add-recovery-email.async-action';

export const addRecoveryEmailDataLoadingAsyncAction = (
  email: string,
  navigation: RootStackNavigationProp
) =>
  dataLoadingAction(addRecoveryEmailAsyncAction, {
    email,
    navigation,
  } as IAddRecoveryEmailAsyncAction);
