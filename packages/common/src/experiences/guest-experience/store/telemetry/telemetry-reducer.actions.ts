// Copyright 2018 Prescryptive Health, Inc.

export enum TelemetryActionKeys {
  SET_MEMBER_INFO_REQUEST_ID = 'SET_MEMBER_INFO_REQUEST_ID',
  SET_PRESCRIPTION_INFO_REQUEST_ID = 'SET_PRESCRIPTION_INFO_REQUEST_ID',
}

export interface ISetMemberInfoRequestIdAction {
  type: TelemetryActionKeys.SET_MEMBER_INFO_REQUEST_ID;
  payload?: string;
}

export interface ISetPrescriptionInfoRequestIdAction {
  type: TelemetryActionKeys.SET_PRESCRIPTION_INFO_REQUEST_ID;
  payload?: string;
}
export type TelemetryActionTypes =
  | ISetMemberInfoRequestIdAction
  | ISetPrescriptionInfoRequestIdAction;

export const setMemberInfoRequestIdAction = (
  memberInfoRequestId?: string
): ISetMemberInfoRequestIdAction => {
  return {
    payload: memberInfoRequestId,
    type: TelemetryActionKeys.SET_MEMBER_INFO_REQUEST_ID,
  };
};

export const setPrescriptionInfoRequestIdAction = (
  prescriptionInfoRequestId?: string
): ISetPrescriptionInfoRequestIdAction => {
  return {
    payload: prescriptionInfoRequestId,
    type: TelemetryActionKeys.SET_PRESCRIPTION_INFO_REQUEST_ID,
  };
};
