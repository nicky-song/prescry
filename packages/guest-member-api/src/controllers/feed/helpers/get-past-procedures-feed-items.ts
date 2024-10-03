// Copyright 2020 Prescryptive Health, Inc.

import {
  IFeedItem,
  ITitleDescriptionContext,
} from '@phx/common/src/models/api-response/feed-response';
import { ApiConstants } from '../../../constants/api-constants';
import { getAllImmunizationRecordsForMember } from '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper';
import { getAllTestResultsForMember } from '../../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper';
import { IFeedItemParams } from './get-feed-item-context';

export async function getPastProcedureFeedItems(
  params: IFeedItemParams
): Promise<IFeedItem[]> {
  const { feed, members, database } = params;
  if (members.length < 1) {
    return [];
  }

  const testResultsFeedItems: IFeedItem[] = [];
  const patientTestResults = await getAllTestResultsForMember(
    members,
    database,
    ApiConstants.APPOINTMENT_NO_SHOW_CODE
  );
  const immunizationRecords = await getAllImmunizationRecordsForMember(
    members,
    database
  );
  if (patientTestResults?.length > 0 || immunizationRecords?.length > 0) {
    const testResultContext: ITitleDescriptionContext = {};
    const feedItem = {
      feedCode: feed.feedCode,
      context: {
        defaultContext: testResultContext,
      },
    };
    if (feed.context) {
      feedItem.context.defaultContext.title = feed.context.title;
      feedItem.context.defaultContext.description = feed.context.description;
      feedItem.context.defaultContext.type = feed.context.type;
      feedItem.context.defaultContext.markDownText = feed.context.markDownText;
    }
    testResultsFeedItems.push(feedItem);
  }
  return testResultsFeedItems;
}
