// Copyright 2020 Prescryptive Health, Inc.

import { IEventIdentifier } from '../../../../models/health-record-event';
import { SchemaDefinition } from 'mongoose';

export const EventIdentifierDefinition =
  (): SchemaDefinition<IEventIdentifier> => ({
    type: { type: String, required: true },
    value: { type: String, required: true },
  });
