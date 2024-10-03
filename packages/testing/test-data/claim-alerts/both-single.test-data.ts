// Copyright 2023 Prescryptive Health, Inc.

import { ClaimAlertsTestDataInterface } from '../claim-alerts-test-data-interface';

export const bothSingleTestData: ClaimAlertsTestDataInterface = {
  planLinkScenario: 'bothSaves',
  tagsStatus: {
    medications: 1,
    tagsSavesActive: 'both',
  },
  regExpCabinet: new RegExp('.*/cabinet.*'),
};
