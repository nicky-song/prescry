// Copyright 2018 Prescryptive Health, Inc.

import {
  defaultClient,
  DistributedTracingModes,
  setup,
  TelemetryClient,
} from 'applicationinsights';
import {
  EnvelopeTelemetry,
  ExceptionTelemetry,
  Telemetry,
} from 'applicationinsights/out/Declarations/Contracts';
import { IConfiguration } from '../configuration';
import { ApiConstants } from '../constants/api-constants';

export let telemetryClient: TelemetryClient;

export function setupAppInsightService(configuration: IConfiguration) {
  const telemetry = setup(configuration.appInsightInstrumentationKey)
    .setAutoCollectRequests(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setAutoDependencyCorrelation(true)
    .setSendLiveMetrics(true)
    .setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C)
    .start();
  const key = defaultClient.context.keys.cloudRole;
  defaultClient.context.tags[key] = configuration.appInsightServiceName;
  defaultClient.context.tags[
    ApiConstants.WAYSTAR_INSURANCE_ELIGIBILITY_API_URL_ENVELOPE_TAG_KEY
  ] = configuration.insuranceEligibilityApiRequestUrl;
  telemetryClient = defaultClient;

  telemetryClient.addTelemetryProcessor(removeStackTraces);

  return telemetry;
}

export function setTelemetryId(
  _telemetryId: 'operationId' | 'operationParentId',
  _operationId: string
) {
  // const telemetryKey = telemetryClient.context.keys[telemetryId];
  // telemetryClient.context.tags[telemetryKey] = operationId;
}

const apiTelemetryEventsPrefix = 'GuestAPI_';

export function logTelemetryEvent(
  eventName: string,
  eventProperties: Telemetry['properties']
) {
  telemetryClient.trackEvent({
    name: `${apiTelemetryEventsPrefix}${eventName}`,
    properties: eventProperties,
  });
}

export function logTelemetryException(ex: ExceptionTelemetry) {
  telemetryClient.trackException(ex);
}

const removeStackTraces = (envelope: EnvelopeTelemetry): boolean => {
  const data = envelope.data.baseData?.data;
  if (
    data?.includes(
      envelope.tags[
        ApiConstants.WAYSTAR_INSURANCE_ELIGIBILITY_API_URL_ENVELOPE_TAG_KEY
      ]
    )
  ) {
    return false;
  }
  return true;
};
