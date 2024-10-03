// Copyright 2020 Prescryptive Health, Inc.

import { IFeedItem } from '@phx/common/src/models/api-response/feed-response';
import {
  IStaticFeed,
  IStaticFeedContextServiceItem,
} from '@phx/common/src/models/static-feed';

export function getDefaultContextFeedItem(
  feed: IStaticFeed,
  services?: IStaticFeedContextServiceItem[]
): IFeedItem {
  const feedItem: IFeedItem = {
    feedCode: feed.feedCode,
  };
  if (feed.context) {
    feedItem.context = {
      defaultContext: {
        ...(feed.context.title && { title: feed.context.title }),
        ...(feed.context.description && {
          description: feed.context.description,
        }),
        ...(feed.context.type && { type: feed.context.type }),
        ...(feed.context.markDownText && {
          markDownText: feed.context.markDownText,
        }),
        ...(services && services.length && { services }),
        ...(feed.context.serviceType && {
          serviceType: feed.context.serviceType,
        }),
      },
    };
  }
  return feedItem;
}
