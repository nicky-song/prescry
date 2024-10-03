// Copyright 2020 Prescryptive Health, Inc.

import {
  FeatureSwitch,
  IFeaturesState,
} from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { IFeedItem } from '@phx/common/src/models/api-response/feed-response';
import { IStaticFeed } from '@phx/common/src/models/static-feed';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getAppointmentFeedItems } from './get-appointment-feed-items';
import { getDefaultContextFeedItem } from './get-default-context-feed-item';
import { getFeedItemForContextServiceList } from './get-feed-item-context-service-list';
import { getMembershipFeedItems } from './get-membership-feed-items';
import { getPastProcedureFeedItems } from './get-past-procedures-feed-items';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { IConfiguration } from '../../../configuration';
export interface IFeedParams {
  members: string[];
  rxGroupTypes: string[];
  database: IDatabase;
  features: IFeaturesState;
  dateOfBirth?: string;
  loggedInMemberIds: string[];
  configuration: IConfiguration;
  loggedInMasterIds?: string[];
}

export interface IFeedContextParams extends IFeedParams {
  feedItems: IStaticFeed[];
}

export interface IFeedItemParams extends IFeedParams {
  feed: IStaticFeed;
}

export async function getFeedContext(
  params: IFeedContextParams
): Promise<IFeedItem[]> {
  const feedItemResponse: IFeedItem[] = [];
  for (const feed of params.feedItems) {
    const contextInfo = await getFeedItemContext({
      feed,
      ...params,
    });
    contextInfo.map((feedItem) => feedItemResponse.push(feedItem));
  }
  return feedItemResponse;
}

export type IFeedProviders = {
  [feedCode: string]: (
    params: IFeedItemParams
  ) => Promise<IFeedItem[]> | IFeedItem[];
};

const feedContextProviders: IFeedProviders = {
  testResults: getPastProcedureFeedItems,
  addMembership: getMembershipFeedItems,
  appointments: getAppointmentFeedItems,
};

export async function getFeedItemContext(
  params: IFeedItemParams
): Promise<IFeedItem[]> {
  const provider = feedContextProviders[params.feed.feedCode];
  if (provider) {
    return await provider(params);
  }
  if (params.feed.context && params.dateOfBirth) {
    const age = CalculateAbsoluteAge(new Date(), params.dateOfBirth);
    const isAgeValid =
      (params.feed.context.minAge && age >= params.feed.context.minAge) ||
      !params.feed.context.minAge;
    const isFeatureEnabled =
      (params.feed.context.featureFlag &&
        params.features[params.feed.context.featureFlag as FeatureSwitch]) ||
      !params.feed.context.featureFlag;
    if (isAgeValid && isFeatureEnabled) {
      if (
        params.feed.context?.serviceList &&
        params.feed.context?.serviceList.length
      ) {
        return getFeedItemForContextServiceList(params, age);
      }
      return [getDefaultContextFeedItem(params.feed)];
    }
    return [];
  }
  return [getDefaultContextFeedItem(params.feed)];
}
