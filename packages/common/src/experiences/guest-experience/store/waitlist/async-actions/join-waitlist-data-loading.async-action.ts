// Copyright 2021 Prescryptive Health, Inc.

import { ICreateWaitlistRequestBody } from '../../../../../models/api-request-body/create-waitlist.request-body';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { joinWaitlistAsyncAction } from './join-waitlist.async-action';

export const joinWaitlistDataLoadingAsyncAction = (
  navigation: AppointmentsStackNavigationProp,
  waitlListInfo: ICreateWaitlistRequestBody
) =>
  dataLoadingAction(joinWaitlistAsyncAction, {
    data: waitlListInfo,
    navigation,
  });
