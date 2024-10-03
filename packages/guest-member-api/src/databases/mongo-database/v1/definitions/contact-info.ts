// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IContactInfo } from '@phx/common/src/models/contact-info';

export const ContactInfoDefinition = (
  address: Schema,
  hour: Schema
): SchemaDefinition<IContactInfo> => ({
  address: {
    required: false,
    type: address,
  },
  email: { type: String, required: false },
  hours: [
    {
      required: true,
      type: hour,
    },
  ],
  name: { type: String, required: true },
  ncpdp: { type: String, required: true },
  phone: { type: String, required: true },
});
