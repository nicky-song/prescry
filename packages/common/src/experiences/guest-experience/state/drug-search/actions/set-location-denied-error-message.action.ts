// Copyright 2021 Prescryptive Health, Inc.

import { IDrugSearchAction } from './drug-search.action';

export type ISetLocationDeniedErrorMessageAction =
  IDrugSearchAction<'SET_LOCATION_DENIED_ERROR_MESSAGE'>;
export const setLocationDeniedErrorMessageAction = (
  message?: string
): ISetLocationDeniedErrorMessageAction => ({
  type: 'SET_LOCATION_DENIED_ERROR_MESSAGE',
  payload: {
    errorMessage: message,
  },
});
