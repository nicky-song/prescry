// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  TwilioErrorMessage,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { validatePhoneNumberErrorType } from '../response-helper';
import { sendOneTimePassword as twilioSendOneTmePassword } from '../twilio-helper';
import { validateAutomationToken } from '../validate-automation-token/validate-automation-token';
import { sendOneTimePassword } from './send-one-time-password';
import { twilioMock } from '../../mock-data/twilio.mock';
import { configurationMock } from '../../mock-data/configuration.mock';

jest.mock('../response-helper', () => ({
  validatePhoneNumberErrorType: jest.fn(),
}));

jest.mock('../validate-automation-token/validate-automation-token', () => ({
  validateAutomationToken: jest.fn(),
}));

jest.mock('../twilio-helper', () => ({
  sendOneTimePassword: jest.fn(),
}));
const twilioSendOneTimePasswordMock = twilioSendOneTmePassword as jest.Mock;

describe('sendOneTimePassword', () => {
  const validateAutomationTokenMock = validateAutomationToken as jest.Mock;
  const validatePhoneNumberErrorTypeMock =
    validatePhoneNumberErrorType as jest.Mock;

  const responseMock = {
    locals: {
      automationPhone: 'X1112223333',
      code: '123456',
    },
  } as unknown as Response;

  const mockNumber = 'phone-number';
  const phoneNumberMock = 'X1111111111';
  const tokenMock = 'fake_automation_token';
  const requestMock = {
    body: { phoneNumber: mockNumber },
    headers: {
      authorization: 'token',
    },
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    twilioSendOneTimePasswordMock.mockReturnValue(
      Promise.resolve({ status: 'approved' })
    );
    validateAutomationTokenMock.mockReturnValue(tokenMock);
  });

  it('should call sendOneTimePassword with phone number from the body ', async () => {
    await sendOneTimePassword(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
      mockNumber
    );
    expect(twilioSendOneTimePasswordMock).toBeCalledWith(
      twilioMock,
      configurationMock.twilioVerificationServiceId,
      requestMock.body.phoneNumber
    );
  });

  it('should return isCodeSent to true when OneTimePassword is successfully sent to the phone number', async () => {
    const actual = await sendOneTimePassword(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
      mockNumber
    );
    expect(actual).toEqual({
      isCodeSent: true,
    });
  });

  it('should return false response for known failure responses', async () => {
    twilioSendOneTimePasswordMock.mockReturnValueOnce(
      Promise.reject({
        code: 60203,
        detail: undefined,
        message: 'Max send attempts reached',
        moreInfo: 'https://www.twilio.com/docs/errors/60203',
        status: HttpStatusCodes.TOO_MANY_REQUESTS,
      })
    );

    validatePhoneNumberErrorTypeMock.mockReturnValueOnce({
      isKnownError: true,
      message: TwilioErrorMessage.TOO_MANY_TIMES,
      type: 'Twilio',
    });

    const actual = await sendOneTimePassword(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
      mockNumber
    );
    expect(validatePhoneNumberErrorTypeMock).toHaveBeenCalledWith(
      HttpStatusCodes.TOO_MANY_REQUESTS,
      60203,
      requestMock.body.phoneNumber
    );
    expect(actual).toEqual({
      isCodeSent: false,
      errorStatus: HttpStatusCodes.TOO_MANY_REQUESTS,
      errorMessage: 'You have tried too many times',
      errorCode: 60203,
    });
  });

  it('should return false response for unknown failure responses', async () => {
    const error = new Error('some-error');
    twilioSendOneTimePasswordMock.mockImplementationOnce(() => {
      throw error;
    });

    validatePhoneNumberErrorTypeMock.mockReturnValueOnce({
      isKnownError: false,
      message: ErrorConstants.INTERNAL_SERVER_ERROR,
    });

    try {
      await sendOneTimePassword(
        requestMock,
        responseMock,
        twilioMock,
        configurationMock,
        mockNumber
      );
      fail('expected exception but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(error);
    }
  });

  it('should return token when token is successfully sent to the validateAutomationToken', () => {
    requestMock.headers = {
      'x-prescryptive-automation-token': tokenMock,
    };

    const validateAutomation = validateAutomationTokenMock(
      requestMock,
      responseMock,
      configurationMock,
      phoneNumberMock
    );
    expect(validateAutomation).toEqual(tokenMock);
  });
});
