// Copyright 2018 Prescryptive Health, Inc.

import { Sender, ServiceBusClient, TopicClient } from '@azure/service-bus';

export let serviceBusClient: ServiceBusClient;
export let topicClientForUpdatePerson: TopicClient;
export let senderForUpdatePerson: Sender;
export let topicClientForUpdateAccount: TopicClient;
export let senderForUpdateAccount: Sender;

export let topicClientForHealthRecordEvent: TopicClient;
export let senderForHealthRecordEvent: Sender;

export let topicClientForAppointmentCancelEvent: TopicClient;
export let senderForAppointmentCancelEvent: Sender;

export let topicClientForCommonBusinessEvent: TopicClient;
export let senderForCommonBusinessEvent: Sender;

export let topicClientForCommonMonitoringEvent: TopicClient;
export let senderForCommonMonitoringEvent: Sender;

export const initializeServiceBus = (
  serviceBusConnectionString: string,
  topicNameUpdatePerson: string,
  topicNameUpdateAccount: string,
  topicNameHealthRecordEvent: string,
  topicNameAppointmentCancelledEvent: string,
  topicCommonBusinessEvent: string,
  topicCommonMonitoringEvent: string
) => {
  serviceBusClient = ServiceBusClient.createFromConnectionString(
    serviceBusConnectionString
  );

  topicClientForUpdatePerson = serviceBusClient.createTopicClient(
    topicNameUpdatePerson
  );
  senderForUpdatePerson = topicClientForUpdatePerson.createSender();

  topicClientForUpdateAccount = serviceBusClient.createTopicClient(
    topicNameUpdateAccount
  );

  senderForUpdateAccount = topicClientForUpdateAccount.createSender();

  topicClientForHealthRecordEvent = serviceBusClient.createTopicClient(
    topicNameHealthRecordEvent
  );

  senderForHealthRecordEvent = topicClientForHealthRecordEvent.createSender();

  topicClientForAppointmentCancelEvent = serviceBusClient.createTopicClient(
    topicNameAppointmentCancelledEvent
  );
  senderForAppointmentCancelEvent =
    topicClientForAppointmentCancelEvent.createSender();

  topicClientForCommonBusinessEvent = serviceBusClient.createTopicClient(
    topicCommonBusinessEvent
  );
  senderForCommonBusinessEvent =
    topicClientForCommonBusinessEvent.createSender();

  topicClientForCommonMonitoringEvent = serviceBusClient.createTopicClient(
    topicCommonMonitoringEvent
  );
  senderForCommonMonitoringEvent =
    topicClientForCommonMonitoringEvent.createSender();
};
