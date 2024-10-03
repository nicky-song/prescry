// Copyright 2020 Prescryptive Health, Inc.

import { IFeedItem } from '../../../../../models/api-response/feed-response';
import { IFeedAction } from './feed-action';

export type IGetFeedResponseAction = IFeedAction<'FEED_RESPONSE', IFeedItem[]>;

export const getFeedResponseAction = (
  feedItems: IFeedItem[]
): IGetFeedResponseAction => ({
  payload: feedItems,
  type: 'FEED_RESPONSE',
});
