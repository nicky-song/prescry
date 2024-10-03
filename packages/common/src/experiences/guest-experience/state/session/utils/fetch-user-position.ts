// Copyright 2022 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { ErrorConstants } from '../../../api/api-response-messages';
import { SessionDispatch } from '../dispatch/session.dispatch';
import { setIsGettingUserLocationDispatch } from '../dispatch/set-is-getting-user-location.dispatch';

export const fetchUserPosition = (
  handleUserPositionChange: (
    userLocation: ILocationCoordinates,
    errorMessage: string
  ) => void,
  sessionDispatch: SessionDispatch
) => {
  const geoSuccess = (position: GeolocationPosition) => {
    handleUserPositionChange(
      {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      },
      ''
    );
  };

  const geoError = (_geoError?: GeolocationPositionError) => {
    handleUserPositionChange({}, ErrorConstants.GEOLOCATION_DETECTION_FAILURE);
  };

  const devicePositionTimeout = 5000;

  try {
    setIsGettingUserLocationDispatch(sessionDispatch, true);

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
      timeout: devicePositionTimeout,
    });
  } catch {
    geoError();
  }
  setIsGettingUserLocationDispatch(sessionDispatch, false);
};
