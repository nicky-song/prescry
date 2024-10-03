// Copyright 2020 Prescryptive Health, Inc.

import { IClaimInformation } from '../../../../models/appointment-event';
import { SchemaDefinition } from 'mongoose';

export const ClaimInformationDefinition =
  (): SchemaDefinition<IClaimInformation> => ({
    prescriberNationalProviderId: { type: String, required: true },
    productOrServiceId: { type: String, required: true },
    providerLegalName: { type: String, required: true },
  });
