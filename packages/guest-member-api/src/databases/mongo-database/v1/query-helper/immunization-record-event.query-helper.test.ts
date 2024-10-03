// Copyright 2021 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import {
  getAllImmunizationRecordsForMember,
  getImmunizationRecordByOrderNumberForMembers,
  getImmunizationRecordByVaccineCodeForMembers,
} from './immunization-record-event.query-helper';

const sortMock = jest.fn();

const findMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});

const findOneMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});

const databaseMock = {
  Models: {
    ImmunizationRecordEventModel: {
      find: findMock,
      findOne: findOneMock,
    },
  },
} as unknown as IDatabase;

describe('getImmunizationRecordByOrderNumberForMembers', () => {
  const memberIds = ['member-id'];
  const orderNumber = '12345';

  it('should call findOne() with required params', async () => {
    await getImmunizationRecordByOrderNumberForMembers(
      memberIds,
      orderNumber,
      databaseMock
    );
    expect(findOneMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'immunization' },
        { 'eventData.orderNumber': orderNumber },
        { 'eventData.memberRxId': { $in: ['member-id'] } },
      ],
    });
  });
});

describe('getImmunizationRecordByVaccineCodeForMembers', () => {
  const memberIds = ['member-id'];
  const vaccineCode = '91301';
  it('should call find() with required params', async () => {
    await getImmunizationRecordByVaccineCodeForMembers(
      memberIds,
      vaccineCode,
      databaseMock
    );
    expect(findMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'immunization' },
        { 'eventData.vaccineCodes.0.code': vaccineCode },
        { 'eventData.memberRxId': { $in: memberIds } },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-createdOn');
  });
});

describe('getAllImmunizationRecordsForMember', () => {
  const memberIds = ['member-id'];
  it('should call find() with required params', async () => {
    await getAllImmunizationRecordsForMember(memberIds, databaseMock);
    expect(findMock).toHaveBeenCalledWith({
      $and: [
        {
          eventType: 'immunization',
        },
        { 'eventData.memberRxId': { $in: memberIds } },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-createdOn');
  });
});
