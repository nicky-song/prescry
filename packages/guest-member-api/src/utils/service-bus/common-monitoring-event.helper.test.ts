// Copyright 2022 Prescryptive Health, Inc.

import { ICommonBusinessMonitoringEventData } from '../../models/common-business-monitoring-event';
import { publishCommonMonitoringEventMessage } from './common-monitoring-event.helper';
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

describe('publishCommonMonitoringEventMessage() ', () => {
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

  it('should calls send() with message body', async () => {
    const mockCommonBusinessMonitoringEventPayload: ICommonBusinessMonitoringEventData =
      {
        idType: 'smartContractId',
        id: '0x3e8b4f3Bd1118e6679cf0187DC0cf6fBE8e6B111',
        messageOrigin: 'connectServiceAgent',
        tags: ['dRx', 'supportDashboard', 'prescriberFeedbackLoop'],
        type: 'notification',
        subject: 'NewRx Received by Blockchain.',
        messageData:
          '{"prescriberNPI":"1902290810","prescriberLocation":{"firstName":"MEGHAN","lastName":"COHN","addressLine1":"399 MIDDLEFORD RD","addressLine2":"","city":"SEAFORD","state":"DE","postalCode":"199733636","phone":"3126296611"}}',
        eventDateTime: '2022-12-06T16:46:36.3317519Z',
      };
    await publishCommonMonitoringEventMessage(
      mockCommonBusinessMonitoringEventPayload
    );
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: mockCommonBusinessMonitoringEventPayload,
    });
  });
});
