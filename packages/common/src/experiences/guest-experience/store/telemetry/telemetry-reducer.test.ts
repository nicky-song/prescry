// Copyright 2018 Prescryptive Health, Inc.

import { DefaultTelemetryState, telemetryReducer } from './telemetry-reducer';
import {
  ISetMemberInfoRequestIdAction,
  ISetPrescriptionInfoRequestIdAction,
} from './telemetry-reducer.actions';
import {
  TelemetryActionKeys,
  TelemetryActionTypes,
} from './telemetry-reducer.actions';

describe('telemetryReducer', () => {
  it('should return  DefaultTelemetryState when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as TelemetryActionTypes;
    const result = telemetryReducer(undefined, action);
    expect(result).toEqual(DefaultTelemetryState);
  });

  it('should update memberInfoRequestId when action type is SET_MEMBER_INFO_REQUEST_ID', () => {
    const action: ISetMemberInfoRequestIdAction = {
      payload: 'new-memberInfoRequestId',
      type: TelemetryActionKeys.SET_MEMBER_INFO_REQUEST_ID,
    };
    const result = telemetryReducer(DefaultTelemetryState, action);
    expect(result).toEqual({
      memberInfoRequestId: 'new-memberInfoRequestId',
      prescriptionInfoRequestId: undefined,
    });
  });

  it('should update prescriptionInfoRequestId when action type is SET_PRESCRIPTION_INFO_REQUEST_ID', () => {
    const action: ISetPrescriptionInfoRequestIdAction = {
      payload: 'new-prescriptionRequestId',
      type: TelemetryActionKeys.SET_PRESCRIPTION_INFO_REQUEST_ID,
    };
    const result = telemetryReducer(DefaultTelemetryState, action);
    expect(result).toEqual({
      memberInfoRequestId: undefined,
      prescriptionInfoRequestId: 'new-prescriptionRequestId',
    });
  });
});
