// Copyright 2022 Prescryptive Health, Inc.

import { setFeedApiInProgressAction } from './set-feed-api-in-progress.action';

describe('setFeedApiInProgressAction', () => {
  it('returns action', () => {
    const action = setFeedApiInProgressAction(true);
    expect(action.type).toEqual('FEED_API_IN_PROGRESS');
    expect(action.payload).toEqual(true);
  });
});
