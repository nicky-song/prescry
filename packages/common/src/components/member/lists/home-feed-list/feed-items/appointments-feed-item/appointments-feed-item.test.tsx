// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { AppointmentsFeedItem } from './appointments-feed-item';
import { IFeedContext } from '../../../../../../models/api-response/feed-response';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { navigateAppointmentsListScreenDispatch } from '../../../../../../experiences/guest-experience/store/navigation/dispatch/navigate-appointments-list-screen.dispatch';
import { rootStackNavigationMock } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useNavigation } from '@react-navigation/native';

jest.mock(
  '../../../../items/title-description-card-item/title-description-card-item',
  () => ({
    TitleDescriptionCardItem: () => <div />,
  })
);

jest.mock(
  '../../../../../../experiences/guest-experience/store/navigation/dispatch/navigate-appointments-list-screen.dispatch'
);
const navigateAppointmentsListScreenDispatchMock =
  navigateAppointmentsListScreenDispatch as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

describe('AppointmentsFeedItem', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });
  it('renders in HomeFeedItem with expected properties', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };

    const feedContext = {
      defaultContext: {
        title: 'Appointments (9)',
        description: 'View all of your appointments',
      },
    } as IFeedContext;

    const testIDMock = 'testID';

    const testRenderer = renderer.create(
      <AppointmentsFeedItem
        viewStyle={viewStyle}
        context={feedContext}
        testID={testIDMock}
      />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);
    expect(homeFeedItem.props.onPress).toBeDefined();
    expect(homeFeedItem.props.viewStyle).toEqual(viewStyle);
    expect(homeFeedItem.props.testID).toEqual(testIDMock);
  });
  it('dispatches to Appointments list screen when onPress is clicked', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };

    const feedContext = {
      defaultContext: {
        title: 'Appointments (9)',
        description: 'View all of your appointments',
      },
    } as IFeedContext;

    const testRenderer = renderer.create(
      <AppointmentsFeedItem viewStyle={viewStyle} context={feedContext} />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);
    homeFeedItem.props.onPress();
    expect(navigateAppointmentsListScreenDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
