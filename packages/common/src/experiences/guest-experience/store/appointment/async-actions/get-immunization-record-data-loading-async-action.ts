// Copyright 2022 Prescryptive Health, Inc.

import { PastProceduresStackNavigationProp } from '../../../navigation/stack-navigators/past-procedures/past-procedures.stack-navigator';
import { getImmunizationRecordAsyncAction } from '../../immunization-record/async-actions/get-immunization-record.async-action';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';

export const getImmunizationRecordDataLoadingAsyncAction = (
  navigation: PastProceduresStackNavigationProp,
  orderNumber: string
) =>
  dataLoadingAction(getImmunizationRecordAsyncAction, {
    navigation,
    orderNumber,
  });