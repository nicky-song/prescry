// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import {
  getAllTestResultsForMember,
  getPatientTestResultByEventId,
  getPatientTestResultForOrderNumber,
  getTestResultByOrderNumberForMembers,
} from './patient-test-result-event.query-helper';

const sortMock = jest.fn();
const findOneMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});
const findMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});

const databaseMock = {
  Models: {
    PatientTestResultEventModel: {
      findOne: findOneMock,
      find: findMock,
    },
  },
} as unknown as IDatabase;

describe('getPatientTestResultByEventId', () => {
  const primaryMemberRxId = 'member-id';
  const testResultEventId = 'test-event-id';

  it('should call findOne() with required params', async () => {
    await getPatientTestResultByEventId(
      primaryMemberRxId,
      testResultEventId,
      databaseMock
    );
    expect(findOneMock).toHaveBeenCalledWith({
      $and: [
        { _id: 'test-event-id' },
        { eventType: 'observation' },
        { 'eventData.primaryMemberRxId': 'member-id' },
      ],
    });
  });
});

describe('getAllTestResultsForMember', () => {
  const memberIds = ['member-id'];
  const noShowCode = 'Z02.9';
  it('should call find() with required params', async () => {
    await getAllTestResultsForMember(memberIds, databaseMock, noShowCode);
    expect(findMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'observation' },
        { 'eventData.primaryMemberRxId': { $in: ['member-id'] } },
        { 'eventData.icd10.0': { $exists: true, $ne: noShowCode } },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-createdOn');
  });
});

describe('getPatientTestResultForOrderNumber', () => {
  const orderNumber = '125601';
  it('should call findOne() with required params', async () => {
    await getPatientTestResultForOrderNumber(orderNumber, databaseMock);
    expect(findOneMock).toHaveBeenCalledWith(
      {
        $and: [
          { eventType: 'observation' },
          { 'eventData.orderNumber': orderNumber },
        ],
      },
      'identifiers eventData createdBy createdOn tags eventType'
    );
    expect(sortMock).toHaveBeenCalledWith('-createdOn');
  });
});

describe('getTestResultByOrderNumberForMembers', () => {
  const orderNumber = '125601';
  const memberIds = ['member-id1', 'memberid-2'];
  it('should call findOne() with required params', async () => {
    await getTestResultByOrderNumberForMembers(
      memberIds,
      orderNumber,
      databaseMock
    );
    expect(findOneMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'observation' },
        { 'eventData.orderNumber': orderNumber },
        { 'eventData.primaryMemberRxId': { $in: memberIds } },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-createdOn');
  });
});
