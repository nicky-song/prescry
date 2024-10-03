// Copyright 2021 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getNearestGeolocation } from '../../../api/api-v1.get-nearest-geolocation';
import { updateUserLocationSettingsDispatch } from '../../../store/settings/dispatch/update-user-location-settings.dispatch';
import { setUserLocationDispatch } from '../../session/dispatch/set-user-location.dispatch';
import { IGetUserLocationAsyncActionArgs } from '../async-actions/get-user-location.async-action';

export const getUserLocationDispatch = async ({
  location: userLocation,
  sessionDispatch,
  reduxDispatch,
  reduxGetState,
}: IGetUserLocationAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await getNearestGeolocation(
    apiConfig,
    userLocation,
    getEndpointRetryPolicy
  );
  const location = response.data.location;
  if (location) {
    setUserLocationDispatch(sessionDispatch, {
      zipCode: location.zipCode,
      city: location.city,
      state: location.state,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    updateUserLocationSettingsDispatch(reduxDispatch, location);
  }
};
