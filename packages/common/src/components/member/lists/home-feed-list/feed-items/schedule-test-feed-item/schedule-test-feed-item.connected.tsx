// Copyright 2020 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { scheduleTestNavigateAsyncAction } from '../../../../../../experiences/guest-experience/store/navigation/actions/schedule-test-navigate.async-action';
import {
  IScheduleTestFeedItemDataProps,
  IScheduleTestFeedItemDispatchProps,
  ScheduleTestFeedItem,
} from './schedule-test-feed-item';
import { RootState } from '../../../../../../experiences/guest-experience/store/root-reducer';

export const mapStateToProps = (
  _: RootState,
  ownProps?: IScheduleTestFeedItemDataProps
): IScheduleTestFeedItemDataProps => {
  return {
    ...ownProps,
  };
};

export const dispatchProps: IScheduleTestFeedItemDispatchProps = {
  navigateAction: scheduleTestNavigateAsyncAction,
};

export const ScheduleTestFeedItemConnected = connect(
  mapStateToProps,
  dispatchProps
)(ScheduleTestFeedItem);
