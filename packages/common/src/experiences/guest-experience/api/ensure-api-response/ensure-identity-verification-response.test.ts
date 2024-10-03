// Copyright 2021 Prescryptive Health, Inc.

import {
  IIdentityVerificationData,
  IIdentityVerificationResponse,
} from '../../../../models/api-response/identity-verification.response';
import { ErrorConstants } from '../../../../theming/constants';
import { ensureIdentityVerificationResponse } from './ensure-identity-verification-response';

describe('ensureIdentityVerificationResponse()', () => {
  it('should throw error if response data is null', () => {
    const mockResponseJson = { data: null, message: '', status: '' };
    expect(() =>
      ensureIdentityVerificationResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should throw error if maskedEmailAddress is missing', () => {
    const mockResponseJson = {
      data: {},
      message: '',
      status: '',
    };
    expect(() =>
      ensureIdentityVerificationResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if drug found', () => {
    const mockResponseJson = {
      data: {
        maskedEmailAddress: 't*****g@email.com',
        maskedPhoneNumber: '(XXX) XXX-1234',
      },
      message: '',
      status: '',
    };
    const result = ensureIdentityVerificationResponse(mockResponseJson);
    expect(result).toEqual({
      data: {
        maskedEmailAddress: 't*****g@email.com',
        maskedPhoneNumber: '(XXX) XXX-1234',
      } as IIdentityVerificationData,
      message: '',
      status: '',
    } as IIdentityVerificationResponse);
  });
});
