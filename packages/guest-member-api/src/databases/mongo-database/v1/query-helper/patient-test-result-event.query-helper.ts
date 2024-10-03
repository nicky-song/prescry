// Copyright 2018 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import { ApiConstants } from '../../../../constants/api-constants';

export const getPatientTestResultByEventId = (
  primaryMemberRxId: string,
  testResultEventId: string,
  database: IDatabase
) =>
  database.Models.PatientTestResultEventModel.findOne({
    $and: [
      { _id: testResultEventId },
      { eventType: ApiConstants.TEST_RESULT_EVENT_TYPE },
      { 'eventData.primaryMemberRxId': primaryMemberRxId },
    ],
  });

export const getTestResultByOrderNumberForMembers = (
  memberIds: string[],
  orderNumber: string,
  database: IDatabase
) =>
  database.Models.PatientTestResultEventModel.findOne({
    $and: [
      { eventType: ApiConstants.TEST_RESULT_EVENT_TYPE },
      { 'eventData.orderNumber': orderNumber },
      { 'eventData.primaryMemberRxId': { $in: memberIds } },
    ],
  }).sort('-createdOn');

export const getAllTestResultsForMember = (
  memberIds: string[],
  database: IDatabase,
  noShowCode: string
) =>
  database.Models.PatientTestResultEventModel.find({
    $and: [
      { eventType: ApiConstants.TEST_RESULT_EVENT_TYPE },
      { 'eventData.primaryMemberRxId': { $in: memberIds } },
      { 'eventData.icd10.0': { $exists: true, $ne: noShowCode } },
    ],
  }).sort('-createdOn');

export const getPatientTestResultForOrderNumber = (
  orderNumber: string,
  database: IDatabase
) =>
  database.Models.PatientTestResultEventModel.findOne(
    {
      $and: [
        { eventType: ApiConstants.TEST_RESULT_EVENT_TYPE },
        { 'eventData.orderNumber': orderNumber },
      ],
    },
    'identifiers eventData createdBy createdOn tags eventType'
  ).sort('-createdOn');
