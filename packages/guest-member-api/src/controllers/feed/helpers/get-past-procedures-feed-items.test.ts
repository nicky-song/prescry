// Copyright 2020 Prescryptive Health, Inc.

import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { getAllImmunizationRecordsForMember } from '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper';
import { getAllTestResultsForMember } from '../../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFeedItemParams } from './get-feed-item-context';
import { getPastProcedureFeedItems } from './get-past-procedures-feed-items';

const membersMock = ['id1'];
const databaseMock = {} as IDatabase;
const dateOfBirth = '01/01/2000';
const noShowCode = 'Z02.9';
const feed = {
  feedCode: 'testResults',
  enabled: true,
  context: {
    type: 'Test Results',
    markDownText: 'Test Text',
    title: 'Test Results',
    description: 'Description for Test Result',
  },
  priority: 1,
};
const feedItemsParams: IFeedItemParams = {
  feed,
  members: membersMock,
  database: databaseMock,
  dateOfBirth,
  features: {} as IFeaturesState,
  rxGroupTypes: ['CASH'],
  loggedInMemberIds: [],
  configuration: configurationMock,
};
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper'
);
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper'
);

const getAllTestResultsForMemberMock = getAllTestResultsForMember as jest.Mock;
const getAllImmunizationRecordsForMemberMock =
  getAllImmunizationRecordsForMember as jest.Mock;

beforeEach(() => {
  getAllTestResultsForMemberMock.mockReset();
  getAllImmunizationRecordsForMemberMock.mockReset();
});

describe('getPastProcedureFeedItems', () => {
  it('should return context for testResults if returned from database and includes icd10 in atleast one of the results', async () => {
    const testResults = [
      {
        _id: 'event-id',
        identifiers: [],
        eventData: {
          primaryMemberRxId: 'id1',
          productOrService: 'test-service',
          fillDate: 'test-date',
          provider: 'rxpharmacy',
          icd10: ['POSITIVE'],
        },
        tags: [],
        eventType: 'observation',
      },
      {
        _id: 'event-id2',
        identifiers: [],
        eventData: {
          primaryMemberRxId: 'id1',
          productOrService: 'test-service',
          fillDate: 'test-date',
          provider: 'rxpharmacy',
          icd10: ['NEGATIVE'],
        },
        tags: [],
        eventType: 'observation',
      },
    ];
    getAllTestResultsForMemberMock.mockReturnValueOnce(testResults);
    getAllImmunizationRecordsForMemberMock.mockReturnValueOnce([]);
    expect(await getPastProcedureFeedItems(feedItemsParams)).toEqual([
      {
        feedCode: 'testResults',
        context: {
          defaultContext: {
            title: 'Test Results',
            description: 'Description for Test Result',
            type: 'Test Results',
            markDownText: 'Test Text',
          },
        },
      },
    ]);
    expect(getAllTestResultsForMemberMock).toHaveBeenNthCalledWith(
      1,
      membersMock,
      databaseMock,
      noShowCode
    );
  });
  it('should not return results from the database if test results doesnt contain icd10 code in the result', async () => {
    getAllTestResultsForMemberMock.mockReturnValueOnce(null);
    expect(await getPastProcedureFeedItems(feedItemsParams)).toEqual([]);
    expect(getAllTestResultsForMemberMock).toHaveBeenNthCalledWith(
      1,
      membersMock,
      databaseMock,
      noShowCode
    );
  });

  it('should return empty array if no test results or vaccines returned from database', async () => {
    getAllTestResultsForMemberMock.mockReturnValueOnce([]);
    getAllImmunizationRecordsForMemberMock.mockReturnValueOnce([]);
    await expect(getPastProcedureFeedItems(feedItemsParams)).resolves.toEqual(
      []
    );
    expect(getAllTestResultsForMemberMock).toHaveBeenNthCalledWith(
      1,
      membersMock,
      databaseMock,
      noShowCode
    );
  });
  it('should return non-empty array if vaccines returned but not test results from database', async () => {
    const vaccineRecords = [
      {
        createdOn: 93884930,
        createdBy: 'test',
        eventData: {
          memberRxId: 'id1',
        },
        eventType: 'immunization',
      },
      {
        createdOn: 93884933,
        createdBy: 'test',
        eventData: {
          memberRxId: 'id1',
        },
        eventType: 'immunization',
      },
    ];
    getAllTestResultsForMemberMock.mockReturnValueOnce([]);
    getAllImmunizationRecordsForMemberMock.mockReturnValueOnce(vaccineRecords);
    await expect(getPastProcedureFeedItems(feedItemsParams)).resolves.toEqual([
      {
        feedCode: 'testResults',
        context: {
          defaultContext: {
            title: 'Test Results',
            description: 'Description for Test Result',
            type: 'Test Results',
            markDownText: 'Test Text',
          },
        },
      },
    ]);
    expect(getAllTestResultsForMemberMock).toHaveBeenNthCalledWith(
      1,
      membersMock,
      databaseMock,
      noShowCode
    );
  });
  it('should return empty array if no members', async () => {
    const localFeed = {
      feedCode: 'testResults',
      enabled: true,
      context: {
        title: 'Test Results',
        description: 'Description for Test Result',
      },
      priority: 1,
    };

    await expect(
      getPastProcedureFeedItems({
        ...feedItemsParams,
        feed: localFeed,
        members: [],
      })
    ).resolves.toEqual([]);
    expect(getAllTestResultsForMemberMock).not.toBeCalled();
    expect(getAllImmunizationRecordsForMemberMock).not.toBeCalled();
  });
});
