// Copyright 2021 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IWaitList } from '../../../../models/wait-list';

export const WaitListDefinition = (
  pharmacyInvitationSchema: Schema
): SchemaDefinition<IWaitList> => ({
  identifier: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  serviceType: { type: String, required: true },
  location: { type: String, required: false },
  status: { type: String, required: false },
  invitation: { type: pharmacyInvitationSchema, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  zipCode: { type: String, required: false },
  maxMilesAway: { type: Number, required: false },
  addedBy: { type: String, required: false },
});
