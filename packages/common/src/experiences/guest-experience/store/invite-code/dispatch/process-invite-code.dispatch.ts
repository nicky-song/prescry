// Copyright 2021 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { Dispatch } from 'react';
import { IProcessInviteCodeActionType } from './process-invite-code-and-navigate.dispatch';
import { processInviteCode } from '../../../api/api-v1.process-invite-code';
import { setCalendarStatusAction } from '../../appointment/actions/set-calendar-status.action';
import { IProcessInviteCodeResponse } from '../../../../../models/api-response/process-invite-code.response';
import { IMarkedDate } from '../../../../../components/member/appointment-calendar/appointment-calendar';
import { setSelectedLocationAction } from '../../appointment/actions/set-selected-location.action';
import { getProviderLocationsResponseAction } from '../../provider-locations/actions/get-provider-locations-response.action';
import { setServiceTypeAction } from '../../service-type/actions/set-service-type.action';
import { setInviteCodeAction } from '../../appointment/actions/set-invite-code.action';
import { setServiceDetailsAction } from '../../service-type/actions/set-service-details.action';

export const processInviteCodeDispatch = async (
  dispatch: Dispatch<IProcessInviteCodeActionType>,
  getState: () => RootState,
  inviteCode: string
): Promise<undefined> => {
  const state = getState();
  const { config, settings } = state;
  const api = config.apis.guestExperienceApi;

  const response: IProcessInviteCodeResponse = await processInviteCode(
    api,
    inviteCode,
    settings.token,
    settings.deviceToken
  );
  await tokenUpdateDispatch(dispatch, response.refreshToken);
  const {
    location,
    availableSlots,
    service,
    minDate,
    maxDate,
    serviceNameMyRx,
    minimumAge,
    aboutQuestionsDescriptionMyRx,
    aboutDependentDescriptionMyRx,
    cancellationPolicyMyRx,
  } = response.data;

  await dispatch(getProviderLocationsResponseAction([location]));
  await dispatch(
    setSelectedLocationAction({
      selectedLocation: location,
      selectedService: service,
      minDate,
      maxDate,
    })
  );
  await dispatch(
    setServiceTypeAction({
      type: service.serviceType,
    })
  );
  await dispatch(
    setServiceDetailsAction({
      serviceNameMyRx,
      minimumAge,
      aboutQuestionsDescriptionMyRx,
      aboutDependentDescriptionMyRx,
      cancellationPolicyMyRx,
    })
  );
  const markedDates: IMarkedDate = {};
  availableSlots.unAvailableDays.forEach((day: string) => {
    markedDates[day] = {
      disabled: true,
      disableTouchEvent: true,
    };
  });
  await dispatch(
    setCalendarStatusAction({
      slots: availableSlots.slots,
      markedDates,
    })
  );
  await dispatch(setInviteCodeAction(inviteCode));

  return;
};
