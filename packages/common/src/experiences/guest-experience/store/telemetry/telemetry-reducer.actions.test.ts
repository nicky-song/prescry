// Copyright 2018 Prescryptive Health, Inc.

import {
  setMemberInfoRequestIdAction,
  setPrescriptionInfoRequestIdAction,
  TelemetryActionKeys,
} from './telemetry-reducer.actions';

describe('setMemberInfoRequestIdAction', () => {
  it('issues setMemberInfoRequestIdAction action', () => {
    const newRequestId = 'new-memeber-request-id';
    const action = setMemberInfoRequestIdAction(newRequestId);
    expect(action).toMatchObject({
      payload: newRequestId,
      type: TelemetryActionKeys.SET_MEMBER_INFO_REQUEST_ID,
    });
  });
});

describe('setPrescriptionInfoRequestIdAction', () => {
  it('issues setPrescriptionInfoRequestIdAction action', () => {
    const newRequestId = 'new-prescription-request-id';
    const action = setPrescriptionInfoRequestIdAction(newRequestId);
    expect(action).toMatchObject({
      payload: newRequestId,
      type: TelemetryActionKeys.SET_PRESCRIPTION_INFO_REQUEST_ID,
    });
  });
});
