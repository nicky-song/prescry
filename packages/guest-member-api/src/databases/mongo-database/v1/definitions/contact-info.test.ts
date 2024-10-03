// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { ContactInfoDefinition } from './contact-info';

describe('ContactInfoDefinition()', () => {
  it('creates instance of SchemaDefinition<IContactInfo>', () => {
    const addressSchema = {} as Schema;
    const hoursSchema = {} as Schema;
    const result = ContactInfoDefinition(addressSchema, hoursSchema);
    expect(result).toMatchObject({
      address: {
        required: false,
        type: addressSchema,
      },
      email: { type: String, required: false },
      hours: [
        {
          required: true,
          type: hoursSchema,
        },
      ],
      name: { type: String, required: true },
      ncpdp: { type: String, required: true },
      phone: { type: String, required: true },
    });
  });
});
