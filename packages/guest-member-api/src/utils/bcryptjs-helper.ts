// Copyright 2018 Prescryptive Health, Inc.

import { compare, genSalt, hash } from 'bcryptjs';

const saltRound = 10;

export const generateSalt = () => genSalt(saltRound);

export const generateHash = (key: string) => hash(key, saltRound);

export const compareHashValue = (key: string, hashVal: string) =>
  compare(key, hashVal);
