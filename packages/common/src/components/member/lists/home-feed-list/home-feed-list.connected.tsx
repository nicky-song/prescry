// Copyright 2020 Prescryptive Health, Inc.

import { connect, MapStateToProps } from 'react-redux';
import { getFeedDataLoadingAsyncAction } from '../../../../experiences/guest-experience/store/feed/async-actions/get-feed-data-loading.async-action';
import { RootState } from '../../../../experiences/guest-experience/store/root-reducer';

import {
  HomeFeedList,
  IHomeFeedListStateProps,
  IHomeFeedListDispatchProps,
  IHomeFeedListOwnProps,
} from './home-feed-list';
import { getFeedAsyncAction } from '../../../../experiences/guest-experience/store/feed/async-actions/get-feed.async-action';

export const mapStateToProps: MapStateToProps<
  IHomeFeedListStateProps,
  IHomeFeedListOwnProps,
  RootState
> = (state, ownProps?): IHomeFeedListStateProps => {
  const { feedItems } = state.feed;
  return {
    ...ownProps,
    feedItems: feedItems || [],
    dataRefreshIntervalMilliseconds:
      state.settings.dataRefreshIntervalMilliseconds || 10000,
  };
};

export const dispatchActions: IHomeFeedListDispatchProps = {
  getFeedDataLoadingAsyncAction,
  getFeedAsyncAction,
};

export const HomeFeedListConnected = connect(
  mapStateToProps,
  dispatchActions
)(HomeFeedList);
