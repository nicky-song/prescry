// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { ErrorConstants } from '../../constants/response-messages';
import { EndpointError } from '../../errors/endpoint.error';
import { configurationMock } from '../../mock-data/configuration.mock';
import {
  authorizeContact,
  ContactType,
  IAuthorizeContactProps,
} from '../external-api/patient-account/authorize-contact';
import { IConfirmContactResponse } from '../external-api/patient-account/confirm-contact';
import { sendOneTimePasswordV2 } from './send-one-time-password-v2';
import { ISendOneTimePasswordResponse } from './send-one-time-password';

jest.mock('../external-api/patient-account/authorize-contact');
const authorizeContactMock = authorizeContact as jest.Mock;

describe('sendOneTimePasswordV2', () => {
  const phone: ContactType = 'phone';
  const email: ContactType = 'email';

  beforeEach(() => {
    authorizeContactMock.mockClear();
  });

  it('throws error if any exception occurs', async () => {
    const phoneNumberMock = 'phone-number-mock';

    const error = new EndpointError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ErrorConstants.INTERNAL_SERVER_ERROR
    );

    authorizeContactMock.mockImplementationOnce(() => {
      throw error;
    });

    try {
      await sendOneTimePasswordV2(configurationMock, phoneNumberMock);
      expect.assertions(1);
    } catch (ex) {
      expect(ex).toEqual(error);
    }
  });

  it.each([
    [
      ErrorConstants.SEND_OTP_CONTACT_NULL,
      ErrorConstants.SEND_OTP_CONTACT_NULL,
    ],
    [
      ErrorConstants.SEND_OTP_CONTACT_INVALID_PHONE_NUMBER,
      ErrorConstants.SEND_OTP_CONTACT_INVALID_PHONE_NUMBER,
    ],
    [
      ErrorConstants.SEND_OTP_CONTACT_TOO_MANY_ATTEMPTS_RESPONSE,
      ErrorConstants.SEND_OTP_CONTACT_TOO_MANY_ATTEMPTS,
    ],
    ['x', ErrorConstants.INTERNAL_SERVER_ERROR],
  ])(
    'returns failure response if any error occurs in send otp request (error: %p)',
    async (errorMessageMock: string, expectedErrorMessage: string) => {
      const phoneNumberMock = 'phone-number-mock';

      const error = new EndpointError(
        HttpStatusCodes.BAD_REQUEST,
        errorMessageMock
      );

      authorizeContactMock.mockImplementation(() => {
        throw error;
      });

      const response = await sendOneTimePasswordV2(
        configurationMock,
        phoneNumberMock
      );

      const expectedResponse: ISendOneTimePasswordResponse = {
        isCodeSent: false,
        errorStatus: error.errorCode,
        errorMessage: expectedErrorMessage,
      };

      expect(response).toEqual(expectedResponse);
    }
  );

  it.each([
    [undefined, phone],
    [phone, phone],
    [email, email],
  ])(
    'returns contact hash when request to send otp endpoint is success (contactType: %p)',
    async (
      contactTypeMock: ContactType | undefined,
      expectedContactType: ContactType
    ) => {
      const contactValueMock = 'contact-value-mock';
      const contactHashMock = 'contact-hash-mock';

      const responseMock: Partial<IConfirmContactResponse> = {
        contactHash: contactHashMock,
      };

      authorizeContactMock.mockResolvedValue(responseMock);

      const actual = await sendOneTimePasswordV2(
        configurationMock,
        contactValueMock,
        contactTypeMock
      );

      const expectedAuthorizeContactProps: IAuthorizeContactProps = {
        contactType: expectedContactType,
        contact: contactValueMock,
      };

      expectToHaveBeenCalledOnceOnlyWith(
        authorizeContactMock,
        configurationMock,
        expectedAuthorizeContactProps
      );

      const expectedResponse: ISendOneTimePasswordResponse = {
        errorCode: undefined,
        errorMessage: undefined,
        errorStatus: undefined,
        isCodeSent: true,
        contactHash: contactHashMock,
      };

      expect(actual).toEqual(expectedResponse);
    }
  );
});
