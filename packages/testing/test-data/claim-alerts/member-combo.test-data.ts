// Copyright 2023 Prescryptive Health, Inc.

import { ClaimAlertsTestDataInterface } from '../claim-alerts-test-data-interface';

export const memberComboTestData: ClaimAlertsTestDataInterface = {
  planLinkScenario: 'memberComboGeneric',
  tagsStatus: {
    medications: 2,
    tagsSavesActive: 'onlyMember',
  },
  regExpCabinet: new RegExp('.*/cabinet.*'),
};
