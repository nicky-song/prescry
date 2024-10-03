// Copyright 2022 Prescryptive Health, Inc.

import { IFindLocationAction } from './find-location.action';

export type ISetLocationErrorMessageAction =
  IFindLocationAction<'SET_LOCATION_ERROR_MESSAGE'>;

export const setLocationErrorMessageAction = (
  locationErrorMessage?: string
): ISetLocationErrorMessageAction => ({
  type: 'SET_LOCATION_ERROR_MESSAGE',
  payload: {
    locationErrorMessage,
  },
});
