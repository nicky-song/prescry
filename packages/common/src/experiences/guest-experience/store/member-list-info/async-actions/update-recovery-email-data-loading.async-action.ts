// Copyright 2021 Prescryptive Health, Inc.

import { IUpdateRecoveryEmailRequestBody } from '../../../../../models/api-request-body/update-recovery-email.request-body';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { updateRecoveryEmailAsyncAction } from './update-recovery-email.async-action';

export const updateRecoveryEmailDataLoadingAsyncAction = (
  requestBody: IUpdateRecoveryEmailRequestBody,
  navigation: RootStackNavigationProp
) =>
  dataLoadingAction(updateRecoveryEmailAsyncAction, {
    requestBody,
    navigation,
  });
