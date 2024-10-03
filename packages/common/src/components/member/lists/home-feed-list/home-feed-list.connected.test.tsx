// Copyright 2020 Prescryptive Health, Inc.

import { getFeedAsyncAction } from '../../../../experiences/guest-experience/store/feed/async-actions/get-feed.async-action';
import { getFeedDataLoadingAsyncAction } from '../../../../experiences/guest-experience/store/feed/async-actions/get-feed-data-loading.async-action';
import { IFeedState } from '../../../../experiences/guest-experience/store/feed/feed.reducer';
import { RootState } from '../../../../experiences/guest-experience/store/root-reducer';
import { IFeedItem } from '../../../../models/api-response/feed-response';
import {
  IHomeFeedListStateProps,
  IHomeFeedListDispatchProps,
  IHomeFeedListOwnProps,
} from './home-feed-list';
import { dispatchActions, mapStateToProps } from './home-feed-list.connected';
import { ISettings } from '../../../../experiences/guest-experience/guest-experience-settings';

const feedItems: IFeedItem[] = [
  { feedCode: 'welcomeMessageCovid' },
  { feedCode: 'scheduleTest' },
  { feedCode: 'idCardCovid' },
  { feedCode: 'testResults' },
];

describe('HomeFeedListConnected', () => {
  it('maps state', () => {
    const feedState: IFeedState = {
      feedItems,
      isFeedApiInProgress: false,
    };

    const settingState: ISettings = {
      dataRefreshIntervalMilliseconds: undefined,
      lastZipCode: 'unknown',
      isDeviceRestricted: false,
    };

    const initialState: RootState = {
      feed: feedState,
      settings: settingState,
    } as RootState;

    const mappedProps: IHomeFeedListStateProps = mapStateToProps(initialState, {
      isScreenCurrent: true,
    });

    const expectedProps: IHomeFeedListStateProps & IHomeFeedListOwnProps = {
      feedItems,
      dataRefreshIntervalMilliseconds: 10000,
      isScreenCurrent: true,
    };
    expect(mappedProps).toEqual(expectedProps);
  });

  it('maps dispatch actions', () => {
    const expectedActions: IHomeFeedListDispatchProps = {
      getFeedAsyncAction,
      getFeedDataLoadingAsyncAction,
    };

    expect(dispatchActions).toEqual(expectedActions);
  });
});
