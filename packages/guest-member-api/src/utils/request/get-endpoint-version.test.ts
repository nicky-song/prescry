// Copyright 2023 Prescryptive Health, Inc.

import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { Request } from 'express';
import { getEndpointVersion } from './get-endpoint-version';

describe('get-endpoint-version', () => {
  it.each(['v1', 'v2'])('should return version %p', (version: string) => {
    const request = {
      headers: {
        [RequestHeaders.apiVersion]: version
      }
    } as unknown as Request;

    const actual = getEndpointVersion(request);
    expect(actual).toEqual(version);
  });

  it('should return v1 if header not found', () => {
    const request = {} as unknown as Request;

    const actual = getEndpointVersion(request);
    expect(actual).toEqual('v1');
  });
});
