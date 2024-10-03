// Copyright 2020 Prescryptive Health, Inc.

import { IFeedItem } from '@phx/common/src/models/api-response/feed-response';
import { getDefaultContextFeedItem } from '../../feed/helpers/get-default-context-feed-item';
import { IFeedItemParams } from './get-feed-item-context';

export const getMembershipFeedItems = (
  params: IFeedItemParams
): IFeedItem[] => {
  const { feed, members, rxGroupTypes } = params;
  if (
    members.length > 0 &&
    rxGroupTypes.find(
      (groupType: string) => groupType === 'SIE' || groupType === 'COVID19'
    )
  ) {
    return [];
  }
  return [getDefaultContextFeedItem(feed)];
};
