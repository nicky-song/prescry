// Copyright 2021 Prescryptive Health, Inc.

import { setInvalidZipErrorMessageAction } from './set-invalid-zip-error-message.action';

describe('setInvalidZipErrorMessageAction', () => {
  it('returns action', () => {
    const action = setInvalidZipErrorMessageAction('error');
    expect(action.type).toEqual('SET_INVALID_ZIP_ERROR_MESSAGE');
    expect(action.payload).toEqual({
      invalidZipErrorMessage: 'error',
    });
  });
});
