// Copyright 2018 Prescryptive Health, Inc.

import { setTelemetryId } from './app-insight-helper';
import {
  setMembersTelemetryIds,
  setPendingPrescriptionsTelemetryIds,
} from './telemetry-helper';

jest.mock('./app-insight-helper', () => ({
  setTelemetryId: jest.fn(),
}));

const setTelemetryIdMock = setTelemetryId as jest.Mock;

beforeEach(() => {
  setTelemetryIdMock.mockReset();
});

describe('setPendingPrescriptionsTelemetryIds()', () => {
  it('should set the pending prescriptions operationId and operationParentId', () => {
    const mockTelemetryIds = [
      { operationId: 'mock-operationId', correlationId: 'mock-correlation-id' },
    ];
    setPendingPrescriptionsTelemetryIds(mockTelemetryIds);
    expect(setTelemetryIdMock).toHaveBeenCalledTimes(2);
    expect(setTelemetryIdMock).toHaveBeenNthCalledWith(
      1,
      'operationId',
      `${mockTelemetryIds[0].operationId}.pending_medication_`
    );
    expect(setTelemetryIdMock).toHaveBeenNthCalledWith(
      2,
      'operationParentId',
      `${mockTelemetryIds[0].operationId}2.`
    );
  });
});

describe('setMembersTelemetryIds', () => {
  it('should set operationId and operationParentId', () => {
    const requestId = 'request-id';
    setMembersTelemetryIds(requestId);
    expect(setTelemetryIdMock).toHaveBeenCalledTimes(2);
    expect(setTelemetryIdMock).toHaveBeenNthCalledWith(
      1,
      'operationId',
      `${requestId}.members_`
    );
    expect(setTelemetryIdMock).toHaveBeenNthCalledWith(
      2,
      'operationParentId',
      requestId
    );
  });
});
