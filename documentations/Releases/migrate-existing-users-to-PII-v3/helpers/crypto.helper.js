// Copyright 2022 Prescryptive Health, Inc.

import { createHash } from 'crypto';

export const generateSHA512Hash = (text) => {
  const sha512Hash = createHash('sha512');
  sha512Hash.update(text);
  return sha512Hash.digest('hex');
};
