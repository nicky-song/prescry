// Copyright 2018 Prescryptive Health, Inc.

import { IAddress } from '@phx/common/src/models/address';
import { SchemaDefinition } from 'mongoose';

export const AddressDefinition = (): SchemaDefinition<IAddress> => ({
  city: { type: String, required: true },
  distance: { type: String, required: false },
  lineOne: { type: String, required: true },
  lineTwo: { type: String, required: false },
  state: { type: String, required: true },
  zip: { type: String, required: true },
});
