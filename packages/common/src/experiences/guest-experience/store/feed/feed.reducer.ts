// Copyright 2020 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { IFeedItem } from '../../../../models/api-response/feed-response';
import { IGetFeedResponseAction } from './actions/get-feed-response.action';
import { ISetFeedApiInProgressAction } from './actions/set-feed-api-in-progress.action';

export interface IFeedState {
  readonly feedItems: IFeedItem[];
  readonly isFeedApiInProgress: boolean;
}

export const defaultFeedState: IFeedState = {
  feedItems: [],
  isFeedApiInProgress: false,
};

export type IFeedActionTypes =
  | IGetFeedResponseAction
  | ISetFeedApiInProgressAction;
export const feedReducer: Reducer<IFeedState, IFeedActionTypes> = (
  state: IFeedState = defaultFeedState,
  action: IFeedActionTypes
) => {
  switch (action.type) {
    case 'FEED_RESPONSE':
      return {
        ...state,
        feedItems: action.payload,
      };
    case 'FEED_API_IN_PROGRESS':
      return {
        ...state,
        isFeedApiInProgress: action.payload,
      };
  }

  return state;
};
