// Copyright 2023 Prescryptive Health, Inc.

import { ClaimAlertsTestDataInterface } from '../claim-alerts-test-data-interface';

export const planSingleTestData: ClaimAlertsTestDataInterface = {
  planLinkScenario: 'planSaves',
  tagsStatus: {
    medications: 1,
    tagsSavesActive: 'onlyPlan',
  },
  regExpCabinet: new RegExp('.*/cabinet.*'),
};
