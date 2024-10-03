// Copyright 2023 Prescryptive Health, Inc.

import { ClaimAlertsTestDataInterface } from '../claim-alerts-test-data-interface';

export const planComboTestData: ClaimAlertsTestDataInterface = {
  planLinkScenario: 'planComboGeneric',
  tagsStatus: {
    medications: 2,
    tagsSavesActive: 'onlyPlan',
  },
  regExpCabinet: new RegExp('.*/cabinet.*'),
};
