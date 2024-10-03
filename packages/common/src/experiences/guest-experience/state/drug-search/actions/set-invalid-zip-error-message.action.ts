// Copyright 2021 Prescryptive Health, Inc.

import { IDrugSearchAction } from './drug-search.action';

export type ISetInvalidZipErrorMessageAction = IDrugSearchAction<
  'SET_INVALID_ZIP_ERROR_MESSAGE'
>;
export const setInvalidZipErrorMessageAction = (
  message?: string
): ISetInvalidZipErrorMessageAction => ({
  type: 'SET_INVALID_ZIP_ERROR_MESSAGE',
  payload: {
    invalidZipErrorMessage: message,
  },
});
