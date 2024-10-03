// Copyright 2021 Prescryptive Health, Inc.

import { scheduleTestNavigateAsyncAction } from '../../../../experiences/guest-experience/store/navigation/actions/schedule-test-navigate.async-action';
import { RootState } from '../../../../experiences/guest-experience/store/root-reducer';
import {
  IServicesListDispatchProps,
  IServicesListOwnProps,
} from './services-list';
import { dispatchProps, mapStateToProps } from './services-list.connected';

describe('ServicesListConnected', () => {
  it('maps state', () => {
    const ownProps = {
      services: [],
    };

    const mappedProps: IServicesListOwnProps = mapStateToProps(
      {} as RootState,
      ownProps
    );

    const expectedProps: IServicesListOwnProps = {
      services: [],
    };
    expect(mappedProps).toEqual(expectedProps);
  });

  it('maps dispatch actions', () => {
    const expectedActions: IServicesListDispatchProps = {
      navigateAction: scheduleTestNavigateAsyncAction,
    };
    expect(dispatchProps).toEqual(expectedActions);
  });
});
