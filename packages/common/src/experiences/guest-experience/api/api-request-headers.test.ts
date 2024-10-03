// Copyright 2018 Prescryptive Health, Inc.

import { RequestHeaders } from './api-request-headers';

describe('RequestHeaders', () => {
  it('accessTokenRequestHeader should be x-access-token', () => {
    expect(RequestHeaders.accessTokenRequestHeader).toBe('x-access-token');
  });

  it('memberInfoRequestId should be x-prescryptive-member-info-request-id', () => {
    expect(RequestHeaders.memberInfoRequestId).toBe(
      'x-prescryptive-member-info-request-id'
    );
  });

  it('prescriptionInfoRequestId should be x-prescryptive-prescripton-info-request-id', () => {
    expect(RequestHeaders.prescriptionInfoRequestId).toBe(
      'x-prescryptive-prescripton-info-request-id'
    );
  });

  it('deviceTokenRequestHeader should be x-prescryptive-device-token', () => {
    expect(RequestHeaders.deviceTokenRequestHeader).toBe(
      RequestHeaders.deviceTokenRequestHeader
    );
  });

  it('refreshAccountToken should be x-prescryptive-refresh-account-token', () => {
    expect(RequestHeaders.refreshAccountToken).toBe(
      'x-prescryptive-refresh-account-token'
    );
  });
});
