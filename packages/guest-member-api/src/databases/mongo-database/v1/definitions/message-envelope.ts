// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IMessageEnvelope } from '@phx/common/src/models/message-envelope';

export const MessageEnvelopeDefinition = (
  pendingPrescriptionsList: Schema
): SchemaDefinition<IMessageEnvelope> => ({
  identifier: { type: String, required: true },
  notificationTarget: { type: String, required: true },
  pendingPrescriptionList: { required: true, type: pendingPrescriptionsList },
});
