// Copyright 2018 Prescryptive Health, Inc.

import { ACTION_UPDATE_ACCOUNT } from '../../constants/service-bus-actions';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../models/terms-and-conditions-acceptance-info';
import { publishAccountUpdateMessage } from './account-update-helper';
import { initializeServiceBus } from './service-bus-helper';

const mockServiceBusClientClose = jest.fn();
const mockTopicClientClose = jest.fn();
const mockSend = jest.fn();
const mockCreateSender = jest.fn();
const mockCreateTopicClient = jest.fn();
const mockTermsAndConditionAcceptanceInfo = {
  allowEmailMessages: true,
  allowSmsMessages: true,
  authToken: 'token',
  browser: 'chrome',
  fromIP: '110.10.10.3',
  hasAccepted: true,
} as ITermsAndConditionsWithAuthTokenAcceptance;

jest.mock('@azure/service-bus', () => ({
  ServiceBusClient: {
    createFromConnectionString: jest.fn().mockImplementation(() => {
      return {
        close: mockServiceBusClientClose,
        createTopicClient: mockCreateTopicClient.mockImplementation(() => {
          return {
            close: mockTopicClientClose,
            createSender: mockCreateSender.mockImplementation(() => {
              return {
                send: mockSend.mockReturnValue('send'),
              };
            }),
          };
        }),
      };
    }),
  },
}));

const mockFirstName = 'mock-firstName';
const mockLastName = 'mock-lastName';
const mockPhoneNumber = 'mock-phoneNumber';
const mockPin = 'mock-pin';
const mockAccountKey = 'mock-accountKey';
const mockDateOfBirth = '2001-10-10';
const mockMasterId = 'master-id';
const mockAccountId = 'account-id';

describe('publishAccountUpdateMessage() ', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('should calls send() with message body', async () => {
    const mockConnectionString = 'mock-connection-string';
    const mockUpdatePersonTopicName = 'mock-topic';
    const mockAccountTopicName = 'mock-account-topic';
    const mockHealthEventTopicName = 'mock-health-event-topic';
    const mockAppointmentCancelledEventTopicName =
      'mock-appointment-cancelled-event-topic';
    const mockCommonBusinessTopic = 'mock-common-business-topic';
    const mockCommonMonitoringEvent = 'mock-common-monitoring-topic';
    const mockLanguageCode = 'es';
    const mockRecentlyUpdatedValue = true;

    initializeServiceBus(
      mockConnectionString,
      mockUpdatePersonTopicName,
      mockAccountTopicName,
      mockHealthEventTopicName,
      mockAppointmentCancelledEventTopicName,
      mockCommonBusinessTopic,
      mockCommonMonitoringEvent
    );
    await publishAccountUpdateMessage({
      accountKey: mockAccountKey,
      dateOfBirth: mockDateOfBirth,
      firstName: mockFirstName,
      lastName: mockLastName,
      phoneNumber: mockPhoneNumber,
      pinHash: mockPin,
      termsAndConditionsAcceptances: mockTermsAndConditionAcceptanceInfo,
      masterId: mockMasterId,
      accountId: mockAccountId,
      languageCode: mockLanguageCode,
      recentlyUpdated: mockRecentlyUpdatedValue,
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_UPDATE_ACCOUNT,
        data: {
          accountKey: mockAccountKey,
          dateOfBirth: mockDateOfBirth,
          firstName: mockFirstName,
          lastName: mockLastName,
          phoneNumber: mockPhoneNumber,
          pinHash: mockPin,
          termsAndConditionsAcceptances: {
            allowEmailMessages: true,
            allowSmsMessages: true,
            authToken: 'token',
            browser: 'chrome',
            fromIP: '110.10.10.3',
            hasAccepted: true,
          },
          masterId: mockMasterId,
          accountId: mockAccountId,
          languageCode: mockLanguageCode,
          recentlyUpdated: mockRecentlyUpdatedValue,
        },
      },
    });
  });
});
