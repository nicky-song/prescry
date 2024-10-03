// Copyright 2021 Prescryptive Health, Inc.

import { LanguageCode } from '@phx/common/src/models/language';
import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IWaitlistRemoveOperationResult } from '../../../models/twilio-web-hook/remove-waitlist-request.body';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  trackWaitlistRemoveFailureEvent,
  trackWaitlistSuccessEvent,
} from '../../../utils/waitlist-custom-event.helper';
import { updateWaitlistStatus } from '../helpers/update-waitlist-status.helper';
import { removeWaitlistHandler } from './remove-waitlist.handler';

jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/waitlist-custom-event.helper');
jest.mock('../../../utils/app-insight-helper', () => ({
  logTelemetryException: jest.fn(),
}));
jest.mock('../helpers/update-waitlist-status.helper');

jest.mock('twilio', () => ({
  validateRequest: jest.fn().mockImplementation(() => {
    return true;
  }),
}));

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

const trackWaitlistRemoveFailureEventMock =
  trackWaitlistRemoveFailureEvent as jest.Mock;
const updateWaitlistStatusMock = updateWaitlistStatus as jest.Mock;
const trackWaitlistSuccessEventMock = trackWaitlistSuccessEvent as jest.Mock;

const databaseMock = {
  Models: {},
} as unknown as IDatabase;

const configurationMock = {
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'pharmacy-url',
  twilioAccountSid: 'twilio-account-id',
  twilioAuthToken: 'twilio-auth-token',
  twilioMessagingFromPhoneNumber: '+11234567890',
  twilioRemoveWaitlistUrl: 'test-url',
} as IConfiguration;

const sendMock = jest.fn();
const typeResultMock = {
  send: sendMock,
};
const statusMock = jest.fn();
const typeMock = jest.fn();

const statusResultMock = {
  type: typeMock,
  send: sendMock,
};

const responseMock = {
  status: statusMock,
  type: typeMock,
} as unknown as Response;

const firstNameMock = 'first-name-mock';
const lastNameMock = 'last-name-mock';
const serviceNameMock = 'service-name-mock';

const updatedStatusSuccessMock: IWaitlistRemoveOperationResult = {
  success: true,
  firstName: firstNameMock,
  lastName: lastNameMock,
  serviceType: 'service-type',
  serviceName: serviceNameMock,
  identifier: 'mock-identifier',
};

const updatedStatusFailureMock: IWaitlistRemoveOperationResult = {
  success: false,
  firstName: firstNameMock,
  lastName: lastNameMock,
  serviceType: 'service-type',
  serviceName: serviceNameMock,
  identifier: 'mock-identifier',
  failureType: 'WaitlistError',
};

describe('removeWaitlistHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    typeMock.mockReturnValue(typeResultMock);
    statusMock.mockReturnValue(statusResultMock);
  });

  it(`should NOT reply back to sender when request body doesn't contain REMOVE`, async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'account-id',
        Body: 'actual-text-message-user-sent',
        From: 'sender-phone-number',
        FromCity: 'fake-city',
        FromState: 'fake-state',
        FromZip: 'zip-code',
        FromCountry: 'fake-country',
        MessageSid: 'messageId-from-twilio',
      },
    } as unknown as Request;

    getRequiredResponseLocalMock.mockReturnValue({
      languageCode: 'en',
    });

    await removeWaitlistHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );
    expect(statusMock).toBeCalledTimes(1);
    expect(typeMock).toBeCalledTimes(1);
    expect(sendMock).toBeCalledTimes(1);
    expect(statusMock).toHaveBeenNthCalledWith(1, 200);
    expect(sendMock).toHaveBeenNthCalledWith(1, '<Response></Response>');
  });

  it(`should NOT reply back to sender when requested accountSid doesn't match with configuration accountSid`, async () => {
    const requestMock = {
      body: {
        To: '+11234567890',
        AccountSid: 'fake-account-id',
        Body: 'remove',
        From: 'sender-phone-number',
        FromCity: 'fake-city',
        FromState: 'fake-state',
        FromZip: 'zip-code',
        FromCountry: 'fake-country',
        MessageSid: 'messageId-from-twilio',
      },
    } as unknown as Request;

    getRequiredResponseLocalMock.mockReturnValue({
      languageCode: 'en',
    });

    await removeWaitlistHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock
    );

    expect(trackWaitlistRemoveFailureEventMock).toBeCalledWith(
      'InvalidAccountSidOrPhone',
      'messageId-from-twilio',
      'sender-phone-number',
      'fake-city',
      'fake-state',
      'zip-code',
      'fake-country',
      ''
    );
    expect(statusMock).toBeCalledTimes(1);
    expect(typeMock).toBeCalledTimes(1);
    expect(sendMock).toBeCalledTimes(1);
    expect(statusMock).toHaveBeenNthCalledWith(1, 200);
    expect(sendMock).toHaveBeenNthCalledWith(1, '<Response></Response>');
  });

  it.each([
    [
      'en' as LanguageCode,
      `<Response><Message>${firstNameMock} ${lastNameMock} has been removed from ${serviceNameMock} waitlist</Message></Response>`,
    ],
    [
      'es' as LanguageCode,
      `<Response><Message>${firstNameMock} ${lastNameMock} ha sido removido de la lista de espera de ${serviceNameMock}</Message></Response>`,
    ],
  ])(
    `should reply SUCCESS removal response back to sender when person is removed from the waitlist when user's preferred language is %p`,
    async (
      languageCodeMock: LanguageCode,
      waitlistRemoveSuccessTextMessageExpected: string
    ) => {
      const requestMock = {
        headers: {
          'x-twilio-signature': 'signature',
        },
        body: {
          To: '+11234567890',
          AccountSid: 'twilio-account-id',
          Body: 'remove',
          From: 'sender-phone-number',
          FromCity: 'fake-city',
          FromState: 'fake-state',
          FromZip: 'zip-code',
          FromCountry: 'fake-country',
          MessageSid: 'messageId-from-twilio',
        },
      } as unknown as Request;

      updateWaitlistStatusMock.mockReturnValueOnce(updatedStatusSuccessMock);

      getRequiredResponseLocalMock.mockReturnValue({
        languageCode: languageCodeMock,
      });

      await removeWaitlistHandler(
        requestMock,
        responseMock,
        databaseMock,
        configurationMock
      );

      expect(updateWaitlistStatusMock).toHaveBeenCalledWith(
        requestMock.body.From,
        databaseMock,
        configurationMock
      );

      expect(trackWaitlistSuccessEventMock).toBeCalledWith(
        'messageId-from-twilio',
        'sender-phone-number',
        'fake-city',
        'fake-state',
        'zip-code',
        'fake-country',
        'mock-identifier'
      );
      expect(statusMock).toBeCalledTimes(1);
      expect(typeMock).toBeCalledTimes(1);
      expect(sendMock).toBeCalledTimes(1);
      expect(statusMock).toHaveBeenNthCalledWith(1, 200);
      expect(sendMock).toHaveBeenNthCalledWith(
        1,
        waitlistRemoveSuccessTextMessageExpected
      );
    }
  );

  it.each([
    [
      'en' as LanguageCode,
      `<Response><Message>We were unable to remove ${firstNameMock} ${lastNameMock} from the waitlist. For further assistance, please contact support@prescryptive.com</Message></Response>`,
    ],
    [
      'es' as LanguageCode,
      `<Response><Message>No ha sido posible remover ${firstNameMock} ${lastNameMock} de la lista de espera. Para más ayuda por favor contacte support@prescryptive.com</Message></Response>`,
    ],
  ])(
    `should send FAILURE response back to sender when person is unable to remove from the waitlist when user's preferred language is %p`,
    async (
      languageCodeMock: LanguageCode,
      waitlistRemoveFailureTextMessageExpected: string
    ) => {
      const requestMock = {
        headers: {
          'x-twilio-signature': 'signature',
        },
        body: {
          To: '+11234567890',
          AccountSid: 'twilio-account-id',
          Body: 'remove',
          From: 'sender-phone-number',
          FromCity: 'fake-city',
          FromState: 'fake-state',
          FromZip: 'zip-code',
          FromCountry: 'fake-country',
          MessageSid: 'messageId-from-twilio',
        },
      } as unknown as Request;

      updateWaitlistStatusMock.mockReturnValueOnce(updatedStatusFailureMock);

      getRequiredResponseLocalMock.mockReturnValue({
        languageCode: languageCodeMock,
      });

      await removeWaitlistHandler(
        requestMock,
        responseMock,
        databaseMock,
        configurationMock
      );

      expect(updateWaitlistStatusMock).toHaveBeenCalledWith(
        requestMock.body.From,
        databaseMock,
        configurationMock
      );

      expect(trackWaitlistRemoveFailureEventMock).toBeCalledWith(
        'WaitlistError',
        'messageId-from-twilio',
        'sender-phone-number',
        'fake-city',
        'fake-state',
        'zip-code',
        'fake-country',
        'mock-identifier',
        undefined
      );
      expect(statusMock).toBeCalledTimes(1);
      expect(typeMock).toBeCalledTimes(1);
      expect(sendMock).toBeCalledTimes(1);
      expect(statusMock).toHaveBeenNthCalledWith(1, 200);
      expect(sendMock).toHaveBeenNthCalledWith(
        1,
        waitlistRemoveFailureTextMessageExpected
      );
    }
  );
});
