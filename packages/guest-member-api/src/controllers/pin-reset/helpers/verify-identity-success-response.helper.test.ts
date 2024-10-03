// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { SuccessConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import { addIdentityVerificationAttemptsKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { SuccessResponse } from '../../../utils/response-helper';
import { maskEmail, maskPhoneNumber } from './mask-values.helper';
import { verifyIdentitySuccessResponse } from './verify-identity-success-response.helper';

jest.mock('../../../databases/redis/redis-query-helper');
jest.mock('./mask-values.helper');
jest.mock('../../../utils/response-helper');

const addIdentityVerificationAttemptsKeyInRedisMock =
  addIdentityVerificationAttemptsKeyInRedis as jest.Mock;
const maskPhoneMock = maskPhoneNumber as jest.Mock;
const maskEmailMock = maskEmail as jest.Mock;
const SuccessResponseMock = SuccessResponse as jest.Mock;
const responseMock = {} as Response;
const phoneNumberMock = '+11112223344';
const emailAddressMock = 'email@email.com';
const maskedPhoneNumberMock = '(111) 222-3344';
const maskedEmailAddressMock = 'e*****l@email.com';
const configurationMock = {
  redisIdentityVerificationKeyExpiryTime: 10,
} as IConfiguration;

describe('verifyIdentitySuccessResponse', () => {
  it('Returns successful response correctly', async () => {
    SuccessResponseMock.mockReturnValue('Success');
    maskPhoneMock.mockReturnValue(maskedPhoneNumberMock);
    maskEmailMock.mockReturnValue(maskedEmailAddressMock);
    const successResponse = await verifyIdentitySuccessResponse(
      responseMock,
      phoneNumberMock,
      emailAddressMock,
      configurationMock
    );
    expect(addIdentityVerificationAttemptsKeyInRedisMock).toBeCalledWith(
      phoneNumberMock,
      10
    );
    expect(maskEmailMock).toBeCalledWith(emailAddressMock);
    expect(maskPhoneMock).toBeCalledWith(phoneNumberMock);
    expect(SuccessResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.VERIFY_IDENTITY_SUCCESS,
      {
        maskedEmailAddress: maskedEmailAddressMock,
        maskedPhoneNumber: maskedPhoneNumberMock,
      }
    );
    expect(successResponse).toEqual('Success');
  });
});
