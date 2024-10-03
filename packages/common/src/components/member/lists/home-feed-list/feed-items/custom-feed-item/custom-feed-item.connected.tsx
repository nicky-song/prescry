// Copyright 2020 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { customFeedNavigateAsyncAction } from '../../../../../../experiences/guest-experience/store/navigation/actions/custom-feed-navigate.async-action';
import { RootState } from '../../../../../../experiences/guest-experience/store/root-reducer';
import {
  CustomFeedItem,
  ICustomFeedItemDataProps,
  ICustomFeedItemDispatchProps,
} from './custom-feed-item';

export const mapStateToProps = (
  _: RootState,
  ownProps: ICustomFeedItemDataProps
): ICustomFeedItemDataProps => {
  return {
    ...ownProps,
  };
};

export const dispatchProps: ICustomFeedItemDispatchProps = {
  navigateAction: customFeedNavigateAsyncAction,
};

export const CustomFeedItemConnected = connect(
  mapStateToProps,
  dispatchProps
)(CustomFeedItem);
