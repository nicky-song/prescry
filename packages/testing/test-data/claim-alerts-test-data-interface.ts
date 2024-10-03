// Copyright 2023 Prescryptive Health, Inc.

import { ClaimType } from '../types/claim-type';

export interface ClaimAlertsTestDataInterface {
  planLinkScenario: ClaimType;
  tagsStatus: {
    medications: 1 | 2;
    tagsSavesActive: 'both' | 'onlyMember' | 'onlyPlan';
  };
  regExpCabinet: RegExp;
}
