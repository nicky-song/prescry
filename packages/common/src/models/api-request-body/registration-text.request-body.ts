// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../language';

export interface IRegistrationTextRequestBody {
  phoneNumber: string;
  path: string;
  language: Language;
}
