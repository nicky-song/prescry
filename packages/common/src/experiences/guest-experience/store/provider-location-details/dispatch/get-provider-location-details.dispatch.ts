// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { RootState } from '../../root-reducer';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { getProviderLocationDetails } from '../../../api/api-v1.get-provider-location-details';
import { IGetProviderLocationDetailsActionType } from '../async-actions/get-provider-location-details.async-action';
import moment from 'moment-timezone';
import { resetAppointmentStateAction } from '../../appointment/actions/reset-appointment-state.action';
import { setSelectedLocationAction } from '../../appointment/actions/set-selected-location.action';
import { getSlotsAndNavigateDispatch } from '../../appointment/dispatch/get-slots-and-navigate.dispatch';
import { IServiceInfo } from '../../../../../models/api-response/provider-location-details-response';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { setServiceDetailsAction } from '../../service-type/actions/set-service-details.action';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const getProviderLocationDetailsDispatch = async (
  dispatch: Dispatch<IGetProviderLocationDetailsActionType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  identifier: string,
  showBackToHome?: boolean
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  const selectedServiceType = state.serviceType?.type;
  if (!selectedServiceType) {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.SERVICE_TYPE_UNDEFINED,
      {}
    );
    throw new Error('Service type is undefined');
  }
  const response = await getProviderLocationDetails(
    api,
    selectedServiceType,
    identifier,
    settings.token,
    getEndpointRetryPolicy,
    settings.deviceToken
  );
  await tokenUpdateDispatch(dispatch, response.refreshToken);
  const { data } = response;
  await dispatch(resetAppointmentStateAction());
  const service = data.location.serviceInfo.find(
    (x: IServiceInfo) => x.serviceType === selectedServiceType
  );
  if (service) {
    const minDaysDuration = moment.duration(service.minLeadDays);
    const maxDaysDuration = moment.duration(service.maxLeadDays);
    const startMoment = moment()
      .tz(data.location.timezone)
      .add(minDaysDuration)
      .startOf('day');
    const start = startMoment.format();
    const minDate = startMoment.format('YYYY-MM-DD');

    const endMoment = startMoment.endOf('month');
    const end = endMoment.format();
    const maxDayMoment = moment()
      .tz(data.location.timezone)
      .add(maxDaysDuration)
      .endOf('day');
    const maxDays = maxDayMoment.format('YYYY-MM-DD');
    await dispatch(
      setSelectedLocationAction({
        selectedLocation: data.location,
        selectedService: service,
        minDate,
        maxDate: maxDays,
      })
    );
    await dispatch(
      setServiceDetailsAction({
        serviceNameMyRx: data.serviceNameMyRx,
        minimumAge: data.minimumAge,
        cancellationPolicyMyRx: data.cancellationPolicyMyRx,
        aboutQuestionsDescriptionMyRx: data.aboutQuestionsDescriptionMyRx,
        aboutDependentDescriptionMyRx: data.aboutDependentDescriptionMyRx,
      })
    );
    await getSlotsAndNavigateDispatch(
      start,
      end,
      dispatch,
      getState,
      navigation,
      showBackToHome
    );
  }
};
