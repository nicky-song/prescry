// Copyright 2023 Prescryptive Health, Inc.

import { ClaimAlertsTestDataInterface } from '../claim-alerts-test-data-interface';

export const bothComboTestData: ClaimAlertsTestDataInterface = {
  planLinkScenario: 'bothComboGeneric',
  tagsStatus: {
    medications: 2,
    tagsSavesActive: 'both',
  },
  regExpCabinet: new RegExp('.*/cabinet.*'),
};
