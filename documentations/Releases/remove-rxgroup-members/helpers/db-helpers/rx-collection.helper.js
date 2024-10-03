// Copyright 2022 Prescryptive Health, Inc.

import { searchCollection } from './collection.helper.js';

export const getPersonsForRx = async (
  { rxGroup, rxSubGroup } = {},
  skip,
  limit
) =>
  searchCollection(
    'Person',
    {
      ...(rxGroup ? { rxGroup } : {}),
      ...(rxSubGroup ? { rxSubGroup } : {}),
      rxGroupType: 'SIE',
      phoneNumber: /^\+1/i,
      $or: [{ deleted: { $exists: false } }, { deleted: false }],
    },
    skip,
    limit
  );
