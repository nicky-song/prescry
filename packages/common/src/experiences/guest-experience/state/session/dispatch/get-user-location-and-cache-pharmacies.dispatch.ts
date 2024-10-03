// Copyright 2021 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getNearestGeolocationAndStorePharmacies } from '../../../api/api-v1.get-nearest-geolocation-and-store-pharmacies';
import { updateUserLocationSettingsDispatch } from '../../../store/settings/dispatch/update-user-location-settings.dispatch';
import { setUserLocationDispatch } from './set-user-location.dispatch';
import { IGetUserLocationAsyncActionArgs } from '../async-actions/get-user-location.async-action';

export const getUserLocationAndCachePharmaciesDispatch = async ({
  location: userLocation,
  sessionDispatch,
  reduxDispatch,
  reduxGetState,
}: IGetUserLocationAsyncActionArgs): Promise<void> => {
  try {
    const state = reduxGetState();
    const { config } = state;
    const apiConfig = config.apis.guestExperienceApi;
    const response = await getNearestGeolocationAndStorePharmacies(
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
    // eslint-disable-next-line no-empty
  } catch (error) {}
};
