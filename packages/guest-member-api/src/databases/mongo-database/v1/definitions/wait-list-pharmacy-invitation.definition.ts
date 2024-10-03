// Copyright 2021 Prescryptive Health, Inc.

import { SchemaDefinition } from 'mongoose';
import { IPharmacyInvitation } from '../../../../models/wait-list';

export const WaitListPharmacyInvitationDefinition =
  (): SchemaDefinition<IPharmacyInvitation> => ({
    start: { type: String, required: true },
    end: { type: String, required: true },
  });
