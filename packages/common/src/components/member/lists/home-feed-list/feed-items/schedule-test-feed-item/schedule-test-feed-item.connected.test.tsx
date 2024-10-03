// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { scheduleTestNavigateAsyncAction } from '../../../../../../experiences/guest-experience/store/navigation/actions/schedule-test-navigate.async-action';
import {
  IScheduleTestFeedItemDataProps,
  IScheduleTestFeedItemDispatchProps,
} from './schedule-test-feed-item';
import {
  dispatchProps,
  mapStateToProps,
} from './schedule-test-feed-item.connected';
import { RootState } from '../../../../../../experiences/guest-experience/store/root-reducer';

describe('ScheduleTestFeedItemConnected', () => {
  it('maps state', () => {
    const customViewStyle: ViewStyle = { backgroundColor: 'red' };
    const ownProps = {
      viewStyle: customViewStyle,
      title: 'title',
      description: 'description',
      serviceType: 'serviceType',
    };

    const mappedProps: IScheduleTestFeedItemDataProps = mapStateToProps(
      {} as RootState,
      ownProps
    );

    const expectedProps: IScheduleTestFeedItemDataProps = {
      viewStyle: customViewStyle,
      title: 'title',
      description: 'description',
      serviceType: 'serviceType',
    };
    expect(mappedProps).toEqual(expectedProps);
  });

  it('maps dispatch actions', () => {
    const expectedActions: IScheduleTestFeedItemDispatchProps = {
      navigateAction: scheduleTestNavigateAsyncAction,
    };
    expect(dispatchProps).toEqual(expectedActions);
  });
});
