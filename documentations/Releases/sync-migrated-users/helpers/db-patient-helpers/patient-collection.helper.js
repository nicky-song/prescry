// Copyright 2023 Prescryptive Health, Inc.

import { searchCollection } from './collection.helper.js';

export const getAllPatientAccounts = (skip, limit) =>
  searchCollection(
    'patient-account-collection',
    {},
    skip,
    limit
  );
