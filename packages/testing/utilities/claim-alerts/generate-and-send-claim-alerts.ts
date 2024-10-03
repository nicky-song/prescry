// Copyright 2022 Prescryptive Health, Inc.

import { altDrugData } from '../../test-data';
import { generateClaimAlerts } from './generate-claim-alerts';
import { processTemplate } from './process-template';
import { ClaimAlert } from '../../services/external';
import { InsuredIndividualConsumer } from '../../types';

const generateAndSendClaimAlerts = async (
  persona: InsuredIndividualConsumer,
  drugs: string[]
) => {
  const drugThings = drugs.map((d) => altDrugData[d]);

  const files = await generateClaimAlerts(persona, drugThings);
  const claimRequests = files.map(async (f) => {
    const claimDocument = processTemplate(f);
    const key = `${f.RequestHeaderSegment.ServiceProviderID}-${f.ClaimSegment.RxNumber}-`;
    const response = await ClaimAlert.send(claimDocument);
    return { key, ...response };
  });
  return Promise.all(claimRequests);
};

export default generateAndSendClaimAlerts;
