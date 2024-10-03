// Copyright 2018 Prescryptive Health, Inc.

import { ITelemetryIds } from '@phx/common/src/models/telemetry-id';
import { setTelemetryId } from './app-insight-helper';

export function setPendingPrescriptionsTelemetryIds(
  telemetryIds: ITelemetryIds[]
) {
  const latestTelemetryEvents = telemetryIds[telemetryIds.length - 1];
  let newOperationId;
  if (latestTelemetryEvents) {
    newOperationId = `${latestTelemetryEvents.operationId}.pending_medication_`;
    setTelemetryId('operationId', newOperationId);
    setTelemetryId(
      'operationParentId',
      `${latestTelemetryEvents.operationId}2.`
    );
  }
  // appending 2. with operationId is the parentId of TextSenderService
  return newOperationId;
}

export function setMembersTelemetryIds(requestId: string) {
  const newOperationId = `${requestId}.members_`;
  setTelemetryId('operationId', newOperationId);
  setTelemetryId('operationParentId', requestId);
  return newOperationId;
}
