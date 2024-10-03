// Copyright 2020 Prescryptive Health, Inc.

import { IVaccineCode } from '../../../../models/immunization-record';
import { SchemaDefinition } from 'mongoose';

export const ImmunizationVaccineCodesDefinition =
  (): SchemaDefinition<IVaccineCode> => ({
    code: { type: String, required: true },
    system: { type: String, required: false },
    display: { type: String, required: false },
  });
