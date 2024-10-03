// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { scheduleTestNavigateAsyncAction } from '../../../../experiences/guest-experience/store/navigation/actions/schedule-test-navigate.async-action';
import { RootState } from '../../../../experiences/guest-experience/store/root-reducer';
import {
  IServicesListDispatchProps,
  IServicesListOwnProps,
  ServicesList,
} from './services-list';

export const mapStateToProps = (
  _: RootState,
  ownProps: IServicesListOwnProps
): IServicesListOwnProps => {
  return {
    ...ownProps,
  };
};

export const dispatchProps: IServicesListDispatchProps = {
  navigateAction: scheduleTestNavigateAsyncAction,
};

export const ServicesListConnected = connect(
  mapStateToProps,
  dispatchProps
)(ServicesList);
