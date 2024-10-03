// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { dispatchProps, mapStateToProps } from './custom-feed-item.connected';
import { RootState } from '../../../../../../experiences/guest-experience/store/root-reducer';
import {
  ICustomFeedItemDataProps,
  ICustomFeedItemDispatchProps,
} from './custom-feed-item';
import { customFeedNavigateAsyncAction } from '../../../../../../experiences/guest-experience/store/navigation/actions/custom-feed-navigate.async-action';


describe('CustomFeedItemConnected', () => {
  it('maps state', () => {
    const customViewStyle: ViewStyle = { backgroundColor: 'red' };
    const ownProps = {
      viewStyle: customViewStyle,
      context: {
        defaultContext: {
          title: 'title',
          description: 'description',
          serviceType: 'serviceType',
        },
      },
    };

    const mappedProps: ICustomFeedItemDataProps = mapStateToProps(
      {} as RootState,
      ownProps
    );

    const expectedProps: ICustomFeedItemDataProps = {
      viewStyle: customViewStyle,
      context: {
        defaultContext: {
          title: 'title',
          description: 'description',
          serviceType: 'serviceType',
        },
      },
    };
    expect(mappedProps).toEqual(expectedProps);
  });

  it('maps dispatch actions', () => {
    const expectedActions: ICustomFeedItemDispatchProps = {
      navigateAction: customFeedNavigateAsyncAction,
    };
    expect(dispatchProps).toEqual(expectedActions);
  });
});
