// Copyright 2018 Prescryptive Health, Inc.

import { Types } from 'mongoose';

export const createRandomString = (): string => {
  return new Types.ObjectId().toString();
};
