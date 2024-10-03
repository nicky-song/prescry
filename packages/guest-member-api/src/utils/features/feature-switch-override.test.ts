// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { featureSwitchOverrideRxGroupType } from './feature-switch-override';
import { IPerson } from '@phx/common/src/models/person';

describe('featureSwitchOverrideRxGroupType', () => {
  it('should return rxgrouptype from feature switch if user is a test member', () => {
    const response = {
      locals: {
        features: {
          usegrouptypecash: 1,
        },
      },
    } as unknown as Response;
    const memberList = [
      {
        isTestMembership: true,
      } as IPerson,
    ];
    const rxGroupType = featureSwitchOverrideRxGroupType(response, memberList);
    expect(rxGroupType).toEqual('CASH');
  });

  it('should not return rxgrouptype from feature switch if user is not a test member', () => {
    const response = {
      locals: {
        features: {
          usegrouptypecash: 1,
        },
      },
    } as unknown as Response;
    const memberList = [
      {
        isTestMembership: false,
      } as IPerson,
    ];
    const rxGroupType = featureSwitchOverrideRxGroupType(response, memberList);
    expect(rxGroupType).toBeUndefined();
  });

  it('should not return rxgrouptype if no feature switch', () => {
    const response = {
      locals: {
        features: {},
      },
    } as unknown as Response;
    const memberList = [
      {
        isTestMembership: true,
      } as IPerson,
    ];
    const rxGroupType = featureSwitchOverrideRxGroupType(response, memberList);
    expect(rxGroupType).toBeUndefined();
  });
});
