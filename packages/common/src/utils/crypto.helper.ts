// Copyright 2018 Prescryptive Health, Inc.

import { createHash } from 'crypto';

export const generateSHA256Hash = (text: string) => {
  const sha256Hash = createHash('sha256');
  sha256Hash.update(text);
  return sha256Hash.digest('base64');
};

export const generateSHA512Hash = (text: string) => {
  const sha512Hash = createHash('sha512');
  sha512Hash.update(text);
  return sha512Hash.digest('hex');
};
