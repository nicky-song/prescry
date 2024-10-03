// Copyright 2020 Prescryptive Health, Inc.

import { IProtocolApplied } from '../../../../models/immunization-record';
import { SchemaDefinition } from 'mongoose';

export const ImmunizationDosesDefinition =
  (): SchemaDefinition<IProtocolApplied> => ({
    series: { type: String, required: true },
    doseNumber: { type: Number, required: true },
    seriesDoses: { type: Number, required: true },
  });
