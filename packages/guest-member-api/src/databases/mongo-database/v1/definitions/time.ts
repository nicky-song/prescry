// Copyright 2018 Prescryptive Health, Inc.

import { IHour } from '@phx/common/src/models/date-time/hours';
import { SchemaDefinition } from 'mongoose';

export const TimeDefinition = (): SchemaDefinition<IHour> => ({
  h: { type: Number, required: false },
  m: { type: Number, required: false },
  pm: { type: Boolean, required: false },
});
