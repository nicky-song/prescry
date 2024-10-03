// Copyright 2020 Prescryptive Health, Inc.

export enum FeedActionKeysEnum {
  FEED_RESPONSE = 'FEED_RESPONSE',
  FEED_API_IN_PROGRESS = 'FEED_API_IN_PROGRESS',
}
export type FeedActionKeys = keyof typeof FeedActionKeysEnum;

export interface IFeedAction<T extends FeedActionKeys, P> {
  type: T;
  payload: P;
}
