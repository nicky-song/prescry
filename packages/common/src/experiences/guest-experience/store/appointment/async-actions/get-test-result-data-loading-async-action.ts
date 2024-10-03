// Copyright 2022 Prescryptive Health, Inc.

import { PastProceduresStackNavigationProp } from '../../../navigation/stack-navigators/past-procedures/past-procedures.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getTestResultAsyncAction } from '../../test-result/async-actions/get-test-result.async-action';

export const getTestResultDataLoadingAsyncAction = (
  navigation: PastProceduresStackNavigationProp,
  orderNumber: string
) =>
  dataLoadingAction(getTestResultAsyncAction, {
    navigation,
    orderNumber,
  });