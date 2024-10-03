// Copyright 2020 Prescryptive Health, Inc.

import { IFeedItem } from '../../../../../models/api-response/feed-response';
import { getFeedResponseAction } from './get-feed-response.action';

describe('getFeedResponse', () => {
  it('returns action', () => {
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
    expect(action.type).toEqual('FEED_RESPONSE');
    expect(action.payload).toEqual(feedItems);
  });
});
