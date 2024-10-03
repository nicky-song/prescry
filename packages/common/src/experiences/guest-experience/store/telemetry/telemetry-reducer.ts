// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import {
  TelemetryActionKeys,
  TelemetryActionTypes,
} from './telemetry-reducer.actions';

export interface ITelemetryState {
  memberInfoRequestId?: string;
  prescriptionInfoRequestId?: string;
}

export const DefaultTelemetryState: ITelemetryState = {
  memberInfoRequestId: undefined,
  prescriptionInfoRequestId: undefined,
};

export const telemetryReducer: Reducer<ITelemetryState, TelemetryActionTypes> =
  (
    state: ITelemetryState = DefaultTelemetryState,
    action: TelemetryActionTypes
  ) => {
    switch (action.type) {
      case TelemetryActionKeys.SET_MEMBER_INFO_REQUEST_ID:
        return { ...state, memberInfoRequestId: action.payload };
      case TelemetryActionKeys.SET_PRESCRIPTION_INFO_REQUEST_ID:
        return { ...state, prescriptionInfoRequestId: action.payload };
    }
    return { ...state };
  };
