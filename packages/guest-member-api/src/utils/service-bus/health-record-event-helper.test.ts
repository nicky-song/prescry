// Copyright 2018 Prescryptive Health, Inc.

import { ACTION_ADD_HEALTH_RECORD_EVENT } from '../../constants/service-bus-actions';
import { IBrokerReferralEvent } from '../../models/broker-referral-event';
import { IConsentEvent } from '../../models/consent-event';
import { IHealthRecordEvent } from '../../models/health-record-event';
import { publishHealthRecordEventMessage } from './health-record-event-helper';
import { initializeServiceBus } from './service-bus-helper';

const mockServiceBusClientClose = jest.fn();
const mockTopicClientClose = jest.fn();
const mockSend = jest.fn();
const mockCreateSender = jest.fn();
const mockCreateTopicClient = jest.fn();

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

describe('publishHealthRecordEventInitMessage() ', () => {
  beforeAll(() => {
    const mockConnectionString = 'mock-connection-string';
    const mockUpdatePersonTopicName = 'mock-topic';
    const mockAccountTopicName = 'mock-account-topic';
    const mockHealthEventTopicName = 'mock-health-event-topic';
    const mockAppointmentCancelledEventTopicName =
      'mock-appointment-cancelled-event-topic';
    const mockCommonBusinessTopic = 'mock-common-business-topic';
    const mockCommonMonitoringEvent = 'mock-common-monitoring-topic';

    initializeServiceBus(
      mockConnectionString,
      mockUpdatePersonTopicName,
      mockAccountTopicName,
      mockHealthEventTopicName,
      mockAppointmentCancelledEventTopicName,
      mockCommonBusinessTopic,
      mockCommonMonitoringEvent
    );
  });

  beforeEach(() => {
    mockSend.mockReset();
  });

  it('should calls send() with message body with consent event', async () => {
    const mockHealthEventInitMessage = {
      identifiers: [{ type: 'primaryMemberRxId', value: 'fake-member-id' }],
      createdOn: 1590614178000,
      createdBy: 'guest-member-api',
      tags: ['fake-member-id'],
      eventType: 'questionnaire/covid-19',
      eventData: {
        sessionId: 'fake-session-id',
        acceptedDateTime: '1590954510',
        authToken: 'token',
        browser: 'chrome',
        fromIP: '192.168.10.3',
      },
    } as IHealthRecordEvent<IConsentEvent>;
    await publishHealthRecordEventMessage(mockHealthEventInitMessage);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_ADD_HEALTH_RECORD_EVENT,
        data: mockHealthEventInitMessage,
      },
    });
  });
  it('should calls send() with message body with broker referral event', async () => {
    const mockHealthEventResponseMessage = {
      identifiers: [{ type: 'primaryMemberRxId', value: 'fake-member-id' }],
      createdOn: 1590614178000,
      createdBy: 'guest-member-api',
      tags: ['fake-member-id'],
      eventType: 'questionnaire/covid-19',
      eventData: {
        memberId: 'member-id',
        brokerId: 'broker-id',
        date: new Date('2020-06-24T01:21:26.000Z'),
      },
    } as IHealthRecordEvent<IBrokerReferralEvent>;

    await publishHealthRecordEventMessage(mockHealthEventResponseMessage);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        action: ACTION_ADD_HEALTH_RECORD_EVENT,
        data: mockHealthEventResponseMessage,
      },
    });
  });
});
