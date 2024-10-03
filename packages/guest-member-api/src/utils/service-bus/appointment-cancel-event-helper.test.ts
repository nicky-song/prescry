// Copyright 2020 Prescryptive Health, Inc.

import { publishAppointmentCancelledEventMessage } from './appointment-cancel-event-helper';
import { initializeServiceBus } from './service-bus-helper';
import { ICancelBookingRequestBody } from '@phx/common/src/models/api-request-body/cancel-booking.request-body';

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

beforeEach(() => {
  mockSend.mockReset();
});

describe('publishAppointmentCancelledEventMessage() ', () => {
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

  it('should calls send() with message body if passed -> user initiated cancellation request', async () => {
    const mockCancellationPayload: ICancelBookingRequestBody = {
      orderNumber: '1234',
      locationId: 'location-id1',
      eventId: 'event-id1',
      reason: 'CustomerInitiatedCancellation',
    };
    await publishAppointmentCancelledEventMessage(mockCancellationPayload);
    const { locationId, orderNumber, eventId, reason } =
      mockCancellationPayload;
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        locationId,
        eventId,
        orderNumber,
        reason,
      },
    });
  });

  it('should calls send() with message body if passed -> session timeout cancellation request', async () => {
    const mockCancellationPayload: ICancelBookingRequestBody = {
      orderNumber: '1234',
      locationId: 'location-id1',
      eventId: 'event-id1',
      reason: 'SystemInitiatedCancellation',
    };
    await publishAppointmentCancelledEventMessage(mockCancellationPayload);
    const { locationId, orderNumber, eventId, reason } =
      mockCancellationPayload;
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      body: {
        locationId,
        eventId,
        orderNumber,
        reason,
      },
    });
  });
});
