// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { Twilio } from 'twilio';
import { sendWaitlistConfirmationMessage } from './send-waitlist-confirmation-message.helper';
import { ICreateWaitListRequest } from '../../../models/pharmacy-portal/create-waitlist.request';
import { EndpointVersion } from '../../../models/endpoint-version';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { LanguageCode } from '@phx/common/src/models/language';

const configurationMock = {
  twilioMessagingFromPhoneNumber: '+1111111111',
} as IConfiguration;

const mockCreate = jest.fn();

const responseMock = {} as unknown as Response;
const versionMock: EndpointVersion = 'v1';

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

const firstNameMock = 'first-name-mock';
const lastNameMock = 'last-name-mock';
const serviceNameMock = 'service-name-mock';
const addedByFirstNameMock = 'added-by-first-name-mock';
const addedByLastNameMock = 'added-by-last-name-mock';

describe('retrieveWaitlistTextMessage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    [
      'en' as LanguageCode,
      `Hi ${firstNameMock} ${lastNameMock}, you have been added to ${serviceNameMock} waitlist. If you would like to be removed from the waitlist and not receive text messages regarding that list, reply "remove"`,
    ],
    [
      'es' as LanguageCode,
      `Hola ${firstNameMock} ${lastNameMock}, usted ha sido añadido a la lista de espera de ${serviceNameMock}. Si le gustaría ser removido de esta lista de espera y no recibir mensajes de texto acerca de esa lista, responda "remover"`,
    ],
  ])(
    `sends Twilio message if added to waitlist by person with same phone number when user's preferred language is %p`,
    async (
      languageCodeMock: LanguageCode,
      waitlistAddedSamePhoneTextMessageExpected: string
    ) => {
      const waitlistMock = {
        phoneNumber: 'test-phone-number',
        addedBy: 'test-phone-number',
        serviceType: 'test-type',
        firstName: firstNameMock,
        lastName: lastNameMock,
      } as ICreateWaitListRequest;

      const twilioClientMock = {
        messages: {
          create: mockCreate,
        },
      } as unknown as Twilio;

      getRequiredResponseLocalMock.mockReturnValue({
        languageCode: languageCodeMock,
      });

      await sendWaitlistConfirmationMessage(
        configurationMock,
        twilioClientMock,
        waitlistMock,
        serviceNameMock,
        responseMock,
        versionMock
      );
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenNthCalledWith(1, {
        to: waitlistMock.phoneNumber,
        body: waitlistAddedSamePhoneTextMessageExpected,
        from: configurationMock.twilioMessagingFromPhoneNumber,
      });
    }
  );
  it.each([
    [
      'en' as LanguageCode,
      `Hi ${firstNameMock} ${lastNameMock}, you have been added to ${serviceNameMock} waitlist by ${addedByFirstNameMock} ${addedByLastNameMock}. If you would like to be removed from the waitlist and not receive text messages regarding that list, reply "remove"`,
    ],
    [
      'es' as LanguageCode,
      `Hola ${firstNameMock} ${lastNameMock}, usted ha sido añadido a la lista de espera de ${serviceNameMock} por ${addedByFirstNameMock} ${addedByLastNameMock}. Si le gustaría ser removido de esta lista de espera y no recibir mensajes de texto acerca de esa lista, responda "remover"`,
    ],
  ])(
    `sends Twilio message if added to waitlist by person with different phone number when user's preferred language is %p`,
    async (
      languageCodeMock: LanguageCode,
      waitlistAddedDifferentPhoneTextMessageExpected: string
    ) => {
      const waitlistMock = {
        phoneNumber: 'test-phone-number',
        addedBy: 'test-phone-number-1',
        serviceType: 'test-type',
        firstName: firstNameMock,
        lastName: lastNameMock,
      } as ICreateWaitListRequest;

      const twilioClientMock = {
        messages: {
          create: mockCreate,
        },
      } as unknown as Twilio;

      getRequiredResponseLocalMock.mockReturnValue({
        languageCode: languageCodeMock,
      });

      await sendWaitlistConfirmationMessage(
        configurationMock,
        twilioClientMock,
        waitlistMock,
        serviceNameMock,
        responseMock,
        versionMock,
        addedByFirstNameMock,
        addedByLastNameMock
      );
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenNthCalledWith(1, {
        to: waitlistMock.phoneNumber,
        body: waitlistAddedDifferentPhoneTextMessageExpected,
        from: configurationMock.twilioMessagingFromPhoneNumber,
      });
    }
  );
});
