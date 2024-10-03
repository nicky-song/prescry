// Copyright 2022 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { autocompleteGeolocation } from '../../../../api/api-v1.autocomplete-geolocation';
import { setSuggestedLocationsDispatch } from './set-suggested-locations.dispatch';
import { setActiveSuggestedLocationDispatch } from './set-active-suggested-location.dispatch';
import { setLocationErrorMessageDispatch } from './set-location-error-message.dispatch';
import { IAutocompleteUserLocationAsyncActionArgs } from '../async-actions/autocomplete-user-location.async-action';

export const autocompleteUserLocationDispatch = async ({
  query,
  location: userLocation,
  defaultSet,
  notFoundErrorMessage,
  findLocationDispatch,
  reduxGetState,
}: IAutocompleteUserLocationAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const response = await autocompleteGeolocation(
    apiConfig,
    query,
    userLocation,
    getEndpointRetryPolicy
  );
  const locations = response.data.locations;
  if (locations) {
    setSuggestedLocationsDispatch(findLocationDispatch, locations);
    if (!locations.length && notFoundErrorMessage) {
      setLocationErrorMessageDispatch(
        findLocationDispatch,
        notFoundErrorMessage
      );
    }
    if (locations.length && defaultSet) {
      setActiveSuggestedLocationDispatch(findLocationDispatch, locations[0]);
    }
  }
};
