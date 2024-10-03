// Copyright 2023 Prescryptive Health, Inc.

import { IValidateIdentity } from '../../../../../models/air/validate-identity.response';
import { setValidateIdentityAction } from './set-validate-identity.action';

describe('setValidateIdentityAction', () => {
  it('returns action', () => {
    const validateIdentityResponseMock: IValidateIdentity = {
      success: true,
      error: '',
    };

    const action = setValidateIdentityAction(validateIdentityResponseMock);
    expect(action.type).toEqual('SET_VALIDATE_IDENTITY');
    expect(action.payload).toEqual({
      validateIdentity: validateIdentityResponseMock,
    });
  });
});
