// Copyright 2020 Prescryptive Health, Inc.

import { getDefaultContextFeedItem } from './get-default-context-feed-item';

import {
  IStaticFeed,
  IStaticFeedContext,
} from '@phx/common/src/models/static-feed';

describe('getDefaultContextFeedItem', () => {
  it('should get context if its there in database', () => {
    const pcrTestFeed: IStaticFeed = {
      feedCode: 'scheduleTestPCR',
      enabled: true,
      context: {
        title: 'Schedule PCR Test',
        description: 'Description for scheduleTestPCR',
      },
      priority: 4,
    };
    const scheduleTestPCRContext = {
      feedCode: 'scheduleTestPCR',
      context: {
        defaultContext: {
          title: 'Schedule PCR Test',
          description: 'Description for scheduleTestPCR',
        },
      },
    };

    const moreInfoTestFeed: IStaticFeed = {
      feedCode: 'faq',
      enabled: true,
      context: {
        type: 'static',
        markDownText: 'click to know more about COVID',
      },
      priority: 300,
    };

    const moreInfoContext = {
      feedCode: 'faq',
      context: {
        defaultContext: {
          type: 'static',
          markDownText: 'click to know more about COVID',
        },
      } as IStaticFeedContext,
    };
    expect(getDefaultContextFeedItem(pcrTestFeed)).toEqual(
      scheduleTestPCRContext
    );
    expect(getDefaultContextFeedItem(moreInfoTestFeed)).toEqual(
      moreInfoContext
    );
  });

  it('should return only feedCode if no context array in the database', () => {
    const moreInfoFeed: IStaticFeed = {
      feedCode: 'welcomeMessage',
      enabled: true,
      priority: 3,
    };
    const moreInfoContext = {
      feedCode: 'welcomeMessage',
    };
    expect(getDefaultContextFeedItem(moreInfoFeed)).toEqual(moreInfoContext);
  });
});
