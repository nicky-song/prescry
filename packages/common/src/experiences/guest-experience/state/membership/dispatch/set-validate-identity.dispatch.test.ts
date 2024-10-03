// Copyright 2023 Prescryptive Health, Inc.

import { IValidateIdentity } from '../../../../../models/air/validate-identity.response';
import { setValidateIdentityAction } from '../actions/set-validate-identity.action';
import { setValidateIdentityDispatch } from './set-validate-identity.dispatch';

describe('setValidateIdentityDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const validateIdentityMock: IValidateIdentity = {
      success: true,
      error: '',
    };

    setValidateIdentityDispatch(dispatchMock, validateIdentityMock);

    const expectedAction = setValidateIdentityAction(validateIdentityMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
