// Copyright 2022 Prescryptive Health, Inc.

import { IFeedAction } from './feed-action';

export type ISetFeedApiInProgressAction = IFeedAction<
  'FEED_API_IN_PROGRESS',
  boolean
>;

export const setFeedApiInProgressAction = (
  isFeedApiInProgress: boolean
): ISetFeedApiInProgressAction => ({
  payload: isFeedApiInProgress,
  type: 'FEED_API_IN_PROGRESS',
});
