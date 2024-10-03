// Copyright 2021 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { setInvalidZipErrorMessageAction } from '../actions/set-invalid-zip-error-message.action';

export const setInvalidZipErrorMessageDispatch = (
  dispatch: DrugSearchDispatch,
  error?: string
): void => {
  dispatch(setInvalidZipErrorMessageAction(error));
};
