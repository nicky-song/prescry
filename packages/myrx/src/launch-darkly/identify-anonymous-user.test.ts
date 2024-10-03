// Copyright 2022 Prescryptive Health, Inc.

import { identifyAnonymousUser } from './identify-anonymous-user';
import { LDClient, LDUser } from 'launchdarkly-js-client-sdk';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

describe('identifyAnonymousUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('identifies anonymous user with Launch Darkly', async () => {
    const ldClientIdentifyMock = jest.fn();
    const ldClientMock = {
      identify: ldClientIdentifyMock,
    } as unknown as LDClient;

    await identifyAnonymousUser(ldClientMock);

    const expectedUser: LDUser = {
      anonymous: true,
    };
    expectToHaveBeenCalledOnceOnlyWith(ldClientIdentifyMock, expectedUser);
  });
});
