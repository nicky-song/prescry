// Copyright 2022 Prescryptive Health, Inc.

import { Twilio } from 'twilio';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { OneTimePasswordVerificationStatus } from '../../constants/one-time-password-verification-status';
import { BadRequestError } from '../../errors/request-errors/bad.request-error';
import { configurationMock } from '../../mock-data/configuration.mock';
import { verifyOneTimePassword } from '../twilio-helper';
import { validateOneTimePassword } from './validate-one-time-password';

jest.mock('../twilio-helper');
const verifyOneTimePasswordMock = verifyOneTimePassword as jest.Mock;

describe('validateOneTimePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['x', false],
    ['approved', true],
  ])(
    'validates one-time password (response status: %p)',
    async (responseStatusMock: string, isValidExpected: boolean) => {
      const verficationResponseMock: Partial<VerificationCheckInstance> = {
        status: responseStatusMock,
      };
      verifyOneTimePasswordMock.mockResolvedValue(verficationResponseMock);

      const twilioClientMock = {} as Twilio;
      const twilioVerificationServiceIdMock =
        configurationMock.twilioVerificationServiceId;
      const phoneNumberMock = 'phone-number';
      const oneTimePasswordMock = '012345';

      try {
        await validateOneTimePassword(
          twilioClientMock,
          twilioVerificationServiceIdMock,
          phoneNumberMock,
          oneTimePasswordMock
        );

        if (!isValidExpected) {
          fail('Expected exception but none thrown!');
        }
      } catch (error) {
        if (isValidExpected) {
          fail('Exception thrown when none expected!');
        }

        const expectedError = new BadRequestError(
          OneTimePasswordVerificationStatus.INVALID_CODE
        );
        expect(error).toEqual(expectedError);
      }

      expect(verifyOneTimePasswordMock).toHaveBeenCalledTimes(1);
      expect(verifyOneTimePasswordMock).toHaveBeenNthCalledWith(
        1,
        twilioClientMock,
        twilioVerificationServiceIdMock,
        phoneNumberMock,
        oneTimePasswordMock
      );
    }
  );
});
