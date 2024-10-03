// Copyright 2021 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import { ApiConstants } from '../../../../constants/api-constants';

export const getImmunizationRecordByOrderNumberForMembers = (
  memberIds: string[],
  orderNumber: string,
  database: IDatabase
) =>
  database.Models.ImmunizationRecordEventModel.findOne({
    $and: [
      { eventType: ApiConstants.IMMUNIZATION_RESULT_TYPE },
      { 'eventData.orderNumber': orderNumber },
      { 'eventData.memberRxId': { $in: memberIds } },
    ],
  }).sort('-createdOn');

export const getImmunizationRecordByVaccineCodeForMembers = (
  memberIds: string[],
  vaccineCode: string,
  database: IDatabase
) =>
  database.Models.ImmunizationRecordEventModel.find({
    $and: [
      { eventType: ApiConstants.IMMUNIZATION_RESULT_TYPE },
      { 'eventData.vaccineCodes.0.code': vaccineCode },
      { 'eventData.memberRxId': { $in: memberIds } },
    ],
  }).sort('-createdOn');

export const getAllImmunizationRecordsForMember = (
  memberIds: string[],
  database: IDatabase
) =>
  database.Models.ImmunizationRecordEventModel.find({
    $and: [
      {
        eventType: ApiConstants.IMMUNIZATION_RESULT_TYPE,
      },
      { 'eventData.memberRxId': { $in: memberIds } },
    ],
  }).sort('-createdOn');
