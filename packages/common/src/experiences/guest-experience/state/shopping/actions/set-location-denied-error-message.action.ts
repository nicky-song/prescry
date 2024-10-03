// Copyright 2021 Prescryptive Health, Inc.

import { IShoppingAction } from './shopping.action';

export type ISetLocationDeniedErrorMessageAction =
  IShoppingAction<'SET_LOCATION_DENIED_ERROR_MESSAGE'>;
export const setLocationDeniedErrorMessageAction = (
  message?: string
): ISetLocationDeniedErrorMessageAction => ({
  type: 'SET_LOCATION_DENIED_ERROR_MESSAGE',
  payload: {
    errorMessage: message,
  },
});
