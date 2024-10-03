// Copyright 2018 Prescryptive Health, Inc.

import { ServiceBusClient } from '@azure/service-bus';

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

const mockCreateFromConnectionString =
  ServiceBusClient.createFromConnectionString as jest.Mock;
const mockConnectionString = 'mock-connection-string';
const mockUpdatePersonTopicName = 'mock-topic';
const mockAccountTopicName = 'mock-update-account';
const mockHealthEventTopicName = 'mock-health-event-topic';
const mockAppointmentCancelledEventTopicName =
  'mock-appointment-cancelled-event-topic';
const mockCommonBusinessTopic = 'mock-common-business-topic';
const mockCommonMonitoringEvent = 'mock-common-monitoring-topic';

describe('initializeServiceBusClientAndTopic', () => {
  beforeAll(() => {
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

  it('should call createFromConnectionString() with connectionString', () => {
    expect(mockCreateFromConnectionString).toHaveBeenCalledTimes(1);
    expect(mockCreateFromConnectionString).toHaveBeenCalledWith(
      mockConnectionString
    );
  });
  it('should call createTopicClient() with topicName', () => {
    expect(mockCreateTopicClient).toHaveBeenCalledTimes(6);
    expect(mockCreateTopicClient.mock.calls[0][0]).toBe(
      mockUpdatePersonTopicName
    );
    expect(mockCreateTopicClient.mock.calls[1][0]).toBe(mockAccountTopicName);
    expect(mockCreateTopicClient.mock.calls[2][0]).toBe(
      mockHealthEventTopicName
    );
    expect(mockCreateTopicClient.mock.calls[3][0]).toBe(
      mockAppointmentCancelledEventTopicName
    );
    expect(mockCreateTopicClient.mock.calls[4][0]).toBe(
      mockCommonBusinessTopic
    );
    expect(mockCreateTopicClient.mock.calls[5][0]).toBe(
      mockCommonMonitoringEvent
    );
  });
  it('should calls createSender()', () => {
    expect(mockCreateSender).toHaveBeenCalledTimes(6);
  });
});
