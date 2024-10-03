// Copyright 2022 Prescryptive Health, Inc.

import { searchCollection } from './collection.helper.js';

const rxGroup = process.env.RX_GROUP;
const overrideNumbers = process.env.OVERRIDE_NUMBERS?.split(',') ?? null;
console.log(overrideNumbers);

const activationQuery = {
  $and: [
    {
      rxGroupType: 'SIE',
      $or: [
        { activationUpdated: { $exists: false } },
        { activationUpdated: false },
      ],
      ...(rxGroup ? { rxGroup } : {}),
    },
    { phoneNumber: '' },
    ...(overrideNumbers
      ? [{ activationPhoneNumber: { $in: overrideNumbers } }]
      : [
          {
            $and: [
              { activationPhoneNumber: { $exists: true } },
              { activationPhoneNumber: { $ne: '' } },
            ],
          },
        ]),
  ],
};

//console.log(JSON.stringify(activationQuery, null, ' '));

export const getActivationUsers = (skip, limit) =>
  searchCollection('Person', activationQuery, skip, limit);
