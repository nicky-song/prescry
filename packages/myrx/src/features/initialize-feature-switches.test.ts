// Copyright 2022 Prescryptive Health, Inc.

import { initializeFeatureSwitches } from './initialize-feature-switches';
import {
  applyLdSwitches,
  applyQuerySwitches,
} from '@phx/common/src/utils/features.helper';
import { GuestExperienceFeatures } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '@phx/common/src/experiences/guest-experience/guest-experience-config';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { LDFlagSet } from 'launchdarkly-js-sdk-common';

jest.mock('@phx/common/src/utils/features.helper');
const applyQuerySwitchesMock = applyQuerySwitches as jest.Mock;
const applyLdSwitchesMock = applyLdSwitches as jest.Mock;

const { location: originalLocation } = window;
const { env: originalEnv } = process.env;

describe('initializeFeatureSwitches', () => {
  afterEach(() => {
    window.location = originalLocation;
    process.env = originalEnv as unknown as NodeJS.ProcessEnv;
  });

  it('initializes switches', () => {
    const searchMock = '?search';
    // @ts-ignore
    delete window.location;
    window.location = {
      search: searchMock,
    } as Location;

    const envMock = { PATH: 'path' };
    process.env = envMock;

    const ldFlagsMock: LDFlagSet = {
      someFlag: 'value',
    };

    const configMock: IGuestExperienceConfig = { ...GuestExperienceConfig };

    initializeFeatureSwitches(configMock, ldFlagsMock);

    expectToHaveBeenCalledOnceOnlyWith(
      applyQuerySwitchesMock,
      GuestExperienceFeatures,
      searchMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      applyLdSwitchesMock,
      GuestExperienceFeatures,
      ldFlagsMock
    );
  });

  it('builds API switches query string for truthy values', () => {
    GuestExperienceFeatures.useblockchain = true;
    GuestExperienceFeatures.usecashprice = false;
    GuestExperienceFeatures.usePatient = true;
    GuestExperienceFeatures.rxSubGroup = 'rx-sub-group';

    const configMock: IGuestExperienceConfig = { ...GuestExperienceConfig };

    initializeFeatureSwitches(configMock, undefined);

    const expectedApiSwitches =
      '?f=useblockchain:1,usePatient:1,rxSubGroup:rx-sub-group';
    expect(configMock.apis.guestExperienceApi.switches).toEqual(
      expectedApiSwitches
    );
  });
});
