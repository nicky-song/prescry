// Copyright 2018 Prescryptive Health, Inc.

import { IMemberLoginState, memberLoginReducer } from './member-login-reducer';
import {
  ISetMemberLoginInfoAction,
  MemberLoginActionTypes,
  MemberLoginStateActionKeys,
} from './member-login-reducer.actions';

const initialState: IMemberLoginState = {};

describe('memberLoginReducer', () => {
  it('should set memberLoginInfo', () => {
    const action: ISetMemberLoginInfoAction = {
      payload: {
        dateOfBirth: 'fake dateOfBirth',
        errorMessage: undefined,
        firstName: 'fake firstName',
        isTermAccepted: true,
        lastName: 'fake lastName',
        primaryMemberRxId: 'fake primaryMemberRxId',
        prescriptionId: 'fake prescriptionId',
        claimAlertId: undefined,
      },
      type: MemberLoginStateActionKeys.SET_MEMBER_LOGIN_INFO,
    };
    const state = memberLoginReducer(initialState, action);
    expect(state.dateOfBirth).toBe(action.payload.dateOfBirth);
    expect(state.firstName).toBe(action.payload.firstName);
    expect(state.isTermAccepted).toBe(action.payload.isTermAccepted);
    expect(state.lastName).toBe(action.payload.lastName);
    expect(state.primaryMemberRxId).toBe(action.payload.primaryMemberRxId);
    expect(state.prescriptionId).toBe(action.payload.prescriptionId);
    expect(state.claimAlertId).toBe(action.payload.claimAlertId);
  });

  it('should return default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as MemberLoginActionTypes;
    const result = memberLoginReducer(undefined, action);
    expect(result).toEqual(initialState);
  });
});
