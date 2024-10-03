// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  HttpStatusCodes,
  TwilioErrorCodes,
} from '@phx/common/src/errors/error-codes';
import { configurationMock } from '../../../../mock-data/configuration.mock';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../../utils/response-helper';
import {
  ISendOTPResponse,
  sendOneTimePasswordHandler,
} from './send-one-time-password.handler';
import { sendOneTimePasswordV2 } from '../../../../utils/one-time-password/send-one-time-password-v2';
import { EndpointVersion } from '../../../../models/endpoint-version';
import { twilioMock } from '../../../../mock-data/twilio.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { sendOneTimePassword } from '../../../../utils/one-time-password/send-one-time-password';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unKnownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../../utils/one-time-password/send-one-time-password');
const sendOneTimePasswordHelperMock = sendOneTimePassword as jest.Mock;

jest.mock('../../../../utils/one-time-password/send-one-time-password-v2');
const sendOneTimePasswordV2Mock = sendOneTimePasswordV2 as jest.Mock;

const responseMock = {
  locals: {
    automationPhone: 'X1112223333',
    code: '123456',
  },
} as unknown as Response;

const mockNumber = 'phone-number';
const requestMock = {
  body: { phoneNumber: mockNumber },
  headers: {
    authorization: 'token',
  },
} as Request;

const v1: EndpointVersion = 'v1';
const v2: EndpointVersion = 'v2';

const requestV2Mock = {
  body: { phoneNumber: mockNumber },
  headers: {
    authorization: 'token',
    [RequestHeaders.apiVersion]: v2,
  },
} as Request;

const contactHashMock = 'contact-hash-mock';

describe('sendOneTimePasswordHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sendOneTimePasswordHelperMock.mockReturnValue({
      isCodeSent: true,
    });
    sendOneTimePasswordV2Mock.mockReturnValue({
      isCodeSent: true,
      contactHash: contactHashMock,
    });
  });

  it('should call sendOneTimepasswordHelper', async () => {
    await sendOneTimePasswordHandler(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
    );
    expect(sendOneTimePasswordHelperMock).toBeCalledWith(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
      requestMock.body.phoneNumber
    );
  });

  it.each([
    [v1, { contactHash: undefined }],
    [v2, { contactHash: contactHashMock }],
  ])(
    'should return success when sendOneTimepasswordHelper function returns isCodeSent as true (endpoint version: %p)',
    async (
      endpointVersionMock: EndpointVersion,
      expectedResponse: ISendOTPResponse
    ) => {
      const mockRequest = endpointVersionMock === v1 ? requestMock : requestV2Mock;
      await sendOneTimePasswordHandler(
        mockRequest,
        responseMock,
        twilioMock,
        configurationMock
      );

      if (endpointVersionMock !== v2) {
        expectToHaveBeenCalledOnceOnlyWith(
          sendOneTimePasswordHelperMock,
          mockRequest,
          responseMock,
          twilioMock,
          configurationMock,
          mockRequest.body.phoneNumber
        );
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          sendOneTimePasswordV2Mock,
          configurationMock,
          mockRequest.body.phoneNumber
        );
      }

      expect(successResponseMock).toBeCalledWith(
        responseMock,
        SuccessConstants.SEND_SUCCESS_MESSAGE,
        expectedResponse
      );
    }
  );

  it('should return KnownFailureResponse when sendOneTimepasswordHelper returns error message', async () => {
    sendOneTimePasswordHelperMock.mockReturnValueOnce({
      isCodeSent: false,
      errorMessage: 'You have tried too many times',
      errorStatus: HttpStatusCodes.TOO_MANY_REQUESTS,
      errorCode: TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED,
    });

    await sendOneTimePasswordHandler(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.TOO_MANY_REQUESTS,
      'You have tried too many times',
      undefined,
      TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED
    );
  });
  it('should return KnownFailureResponse with error codes if exists when sendOneTimepasswordHelper returns error message', async () => {
    sendOneTimePasswordHelperMock.mockReturnValueOnce({
      isCodeSent: false,
      errorMessage: 'unsupported land line number',
      errorStatus: HttpStatusCodes.FORBIDDEN_ERROR,
      errorCode: TwilioErrorCodes.UNSUPPORTED_LANDLINE_NUMBER,
    });

    await sendOneTimePasswordHandler(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      'unsupported land line number',
      undefined,
      TwilioErrorCodes.UNSUPPORTED_LANDLINE_NUMBER
    );
  });

  it('should return INTERNAL_SERVER_ERROR for unknown failure responses', async () => {
    const error = new Error('some-error');
    sendOneTimePasswordHelperMock.mockImplementationOnce(() => {
      throw error;
    });

    await sendOneTimePasswordHandler(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
    );
    expect(unKnownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
