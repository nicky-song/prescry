// Copyright 2022 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import {
  IUpdateSettingsAction,
  updateSettingsAction,
} from '../settings-reducer.actions';
import {
  GuestExperienceSettings,
  ISettings,
} from '../../../guest-experience-settings';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';

export const updateUserLocationSettingsDispatch = async (
  dispatch: Dispatch<IUpdateSettingsAction>,
  userLocation: ILocationCoordinates
) => {
  const currentSettings = await GuestExperienceSettings.current();
  const updatedSettings: ISettings = {
    ...currentSettings,
    userLocation,
    lastZipCode: userLocation.zipCode ?? '',
  };
  await GuestExperienceSettings.update(updatedSettings);
  await dispatch(updateSettingsAction(updatedSettings));
};
