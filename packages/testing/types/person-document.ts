// Copyright 2023 Prescryptive Health, Inc.

import { Document } from 'mongodb';

export class PersonDocument extends Document {
  _id: unknown;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  activationPhoneNumber?: string;
  isPhoneNumberVerified?: boolean;
}
