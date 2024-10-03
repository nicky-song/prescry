// Copyright 2020 Prescryptive Health, Inc.

import { IFeedItem } from '../../../../models/api-response/feed-response';
import { getFeedResponseAction } from './actions/get-feed-response.action';
import { setFeedApiInProgressAction } from './actions/set-feed-api-in-progress.action';
import { feedReducer, IFeedState } from './feed.reducer';

describe('FeedReducer', () => {
  it('updates state for get feed response', () => {
    const feedItems: IFeedItem[] = [
      {
        feedCode: 'a',
      },
      {
        feedCode: 'b',
      },
      {
        feedCode: 'c',
      },
    ];

    const action = getFeedResponseAction(feedItems);
    const expectedState: IFeedState = {
      feedItems,
      isFeedApiInProgress: false,
    };

    const initialState: IFeedState = {
      feedItems: [],
      isFeedApiInProgress: false,
    };
    const updatedState = feedReducer(initialState, action);
    expect(updatedState).toEqual(expectedState);
  });
  it('updates state for set feed api in progress action', () => {
    const feedItems: IFeedItem[] = [
      {
        feedCode: 'a',
      },
      {
        feedCode: 'b',
      },
      {
        feedCode: 'c',
      },
    ];

    const action = setFeedApiInProgressAction(true);
    const expectedState: IFeedState = {
      feedItems,
      isFeedApiInProgress: true,
    };

    const initialState: IFeedState = {
      feedItems,
      isFeedApiInProgress: false,
    };
    const updatedState = feedReducer(initialState, action);
    expect(updatedState).toEqual(expectedState);
  });
});
