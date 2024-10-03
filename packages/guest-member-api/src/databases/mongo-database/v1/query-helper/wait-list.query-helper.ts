// Copyright 2021 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';

export const getWaitListByIdentifier = (
  database: IDatabase,
  identifier: string
) =>
  database.Models.WaitListModel.findOne(
    { identifier: identifier.trim() },
    'identifier phoneNumber location serviceType status invitation'
  );

export const getValidWaitlistForPhoneAndServiceType = (
  database: IDatabase,
  phoneNumber: string,
  serviceType: string
) =>
  database.Models.WaitListModel.find(
    {
      phoneNumber: phoneNumber.trim(),
      serviceType: serviceType.trim(),
      status: { $in: ['invited', '', undefined] },
    },
    'identifier phoneNumber location serviceType status invitation firstName lastName dateOfBirth'
  );

export const getRecentWaitlistForPhone = (
  database: IDatabase,
  phoneNumber: string
) =>
  database.Models.WaitListModel.findOne(
    {
      phoneNumber: phoneNumber.trim(),
      status: { $nin: ['cancelled', 'canceled'] },
    },
    'identifier phoneNumber location serviceType status invitation firstName lastName dateOfBirth'
  ).sort('-dateAdded');
