// Copyright 2020 Prescryptive Health, Inc.

import { IRefreshTokenResponse, withRefreshToken } from './with-refresh-token';
import { RequestHeaders } from './api-request-headers';

interface ITestObject extends IRefreshTokenResponse {
  prop: string;
}

describe('withRefreshToken', () => {
  it('adds expected properties to object', () => {
    const testObject: ITestObject = { prop: 'Hi' };
    const refreshToken = 'refresh-token';
    const refreshDeviceToken = 'updated-device-token';
    const headers: Headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);
    headers.append(RequestHeaders.refreshDeviceToken, refreshDeviceToken);
    const response = new Response(undefined, { headers });

    const withToken = withRefreshToken<ITestObject>(testObject, response);

    const expectedResult: ITestObject = {
      ...testObject,
      refreshToken,
      refreshDeviceToken,
    };
    expect(withToken).toEqual(expectedResult);
  });

  it('returns original object when no headers', () => {
    const testObject: ITestObject = { prop: 'Hi' };
    const expectedObject = { ...testObject };

    const withToken = withRefreshToken<ITestObject>(testObject, new Response());
    expect(withToken).toEqual(expectedObject);
  });
});
