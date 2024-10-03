// Copyright 2023 Prescryptive Health, Inc.

import { searchCollection } from './collection.helper.js';

const overrideNumbers = process.env.OVERRIDE_NUMBERS?.split(',') ?? null;

export const getPublishedCashUsers = async (skip, limit) =>
  searchCollection(
    'Person',
    {
      $and: [
        { rxGroupType: 'CASH', rxSubGroup: 'CASH01' },
        ...(overrideNumbers
          ? [{ phoneNumber: { $in: overrideNumbers } }]
          : [
              {
                $and: [
                  { phoneNumber: { $exists: true } },
                  { phoneNumber: { $ne: '' } },
                  { phoneNumber: /\+1/i },
                ],
              },
            ]),
        { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
        { masterId: { $ne: null } },
        { accountId: { $ne: null } },
      ],
    },
    skip,
    limit
  );
