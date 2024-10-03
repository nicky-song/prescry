// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { generateSHA512Hash } from '@phx/common/src/utils/crypto.helper';
import { HttpStatusCodes } from '../../constants/error-codes';
import { OneTimePasswordVerificationStatus } from '../../constants/one-time-password-verification-status';
import { BadRequestError } from '../../errors/request-errors/bad.request-error';
import { EndpointError } from '../../errors/endpoint.error';
import { configurationMock } from '../../mock-data/configuration.mock';
import { PATIENT_ACCOUNT_SOURCE_MYRX } from '../../models/platform/patient-account/patient-account';
import {
  confirmContact,
  IConfirmContactProps,
  IConfirmContactResponse,
} from '../external-api/patient-account/confirm-contact';
import { validateOneTimePasswordV2 } from './validate-one-time-password.v2';

jest.mock('@phx/common/src/utils/crypto.helper');
const generateSHA512HashMock = generateSHA512Hash as jest.Mock;

jest.mock('../external-api/patient-account/confirm-contact');
const confirmContactMock = confirmContact as jest.Mock;

describe('validateOneTimePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([[false], [true]])(
    'calls confirm contact (isVerified: %p)',
    async (isVerifiedMock: boolean) => {
      const contactValueMock = 'contact-value';
      const oneTimePasswordMock = 'one-time-password';

      const contactHashMock = 'contact-hash';
      generateSHA512HashMock.mockReturnValue(contactHashMock);

      const confirmContactResponseMock: Partial<IConfirmContactResponse> = {
        isVerified: isVerifiedMock,
      };
      confirmContactMock.mockResolvedValue(confirmContactResponseMock);

      try {
        await validateOneTimePasswordV2(
          configurationMock,
          contactValueMock,
          oneTimePasswordMock
        );

        if (!isVerifiedMock) {
          fail('Exception expected but none thrown!');
        }
      } catch (error) {
        if (isVerifiedMock) {
          throw error;
        }

        const expectedError = new BadRequestError(
          OneTimePasswordVerificationStatus.INVALID_CODE
        );
        expect(error).toEqual(expectedError);
      }

      expectToHaveBeenCalledOnceOnlyWith(
        generateSHA512HashMock,
        contactValueMock
      );

      const expectedConfirmContactProps: IConfirmContactProps = {
        contactValue: contactValueMock,
        contactHash: contactHashMock,
        source: PATIENT_ACCOUNT_SOURCE_MYRX,
        confirmationCode: oneTimePasswordMock,
      };
      expectToHaveBeenCalledOnceOnlyWith(
        confirmContactMock,
        configurationMock,
        expectedConfirmContactProps
      );
    }
  );

  it.each([
    [HttpStatusCodes.BAD_REQUEST],
    [HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ])(
    'throws Bad Request error if endpoint throws BAD_REQUEST (endpointStatus: %p)',
    async (endpointStatusMock: number) => {
      const phoneNumberMock = 'phone-number';
      const oneTimePasswordMock = 'one-time-password';

      const phoneHashMock = 'phone-hash';
      generateSHA512HashMock.mockReturnValue(phoneHashMock);

      const endpointErrorMock = new EndpointError(endpointStatusMock);
      confirmContactMock.mockImplementation(() => {
        throw endpointErrorMock;
      });

      try {
        await validateOneTimePasswordV2(
          configurationMock,
          phoneNumberMock,
          oneTimePasswordMock
        );
        fail('Exception expected but none thrown!');
      } catch (error) {
        const expectedError =
          endpointStatusMock === HttpStatusCodes.BAD_REQUEST
            ? new BadRequestError(
                OneTimePasswordVerificationStatus.INVALID_CODE
              )
            : endpointErrorMock;

        expect(error).toEqual(expectedError);
      }
    }
  );
});
