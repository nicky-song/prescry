// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';

export const searchStaticFeed = (
  database: IDatabase,
  audience: string[],
  currentDate: Date
) =>
  database.Models.StaticFeedModel.find({
    $and: [
      { enabled: true },
      {
        $or: [
          { endDate: { $exists: false } },
          { endDate: { $gte: currentDate } },
        ],
      },
      {
        $or: [
          { startDate: { $exists: false } },
          { startDate: { $lte: currentDate } },
        ],
      },
      {
        $or: [
          { audience: { $exists: false } },
          {
            $and: [
              { 'audience.include': { $exists: false } },
              { 'audience.exclude': { $exists: false } },
            ],
          },
          {
            $and: [
              { 'audience.exclude': { $exists: true } },
              { 'audience.exclude': { $nin: audience } },
            ],
          },
          {
            $and: [
              { 'audience.include': { $exists: true } },
              { 'audience.include': { $in: audience } },
            ],
          },
        ],
      },
    ],
  })
    .sort({ priority: 1 })
    .select({ feedCode: 1, context: 1, priorty: 1, _id: 0 });
