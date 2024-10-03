// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IHours } from '@phx/common/src/models/date-time/hours';
import {} from 'mongoose';
export const HourDefinition = (time: Schema): SchemaDefinition<IHours> => ({
  closes: { type: time, required: false },
  day: { type: String, required: true },
  opens: { type: time, required: false },
});
