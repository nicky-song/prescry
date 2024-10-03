// Copyright 2018 Prescryptive Health, Inc.

import { IPrescriptionFillOptions } from '@phx/common/src/models/prescription';
import { SchemaDefinition } from 'mongoose';

export const FillOptionsDefinition =
  (): SchemaDefinition<IPrescriptionFillOptions> => ({
    authorizedRefills: { required: true, type: Number },
    count: { required: true, type: Number },
    daysSupply: { required: false, type: Number },
    fillNumber: { required: true, type: Number },
  });
