// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { ScheduleTestFeedItem } from './schedule-test-feed-item';
import { useNavigation } from '@react-navigation/native';
import { appointmentsStackNavigationMock } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../../items/title-description-card-item/title-description-card-item',
  () => ({
    TitleDescriptionCardItem: () => <div />,
  })
);

describe('ScheduleTestFeedItem', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(appointmentsStackNavigationMock);
  });
  it('renders in HomeFeedItem with expected properties', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };
    const navigateAction = jest.fn();
    const testIDMock = 'testIDMock';

    const testRenderer = renderer.create(
      <ScheduleTestFeedItem
        viewStyle={viewStyle}
        navigateAction={navigateAction}
        title={'title'}
        description={'description'}
        serviceType={'serviceType'}
        testID={testIDMock}
      />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);

    expect(homeFeedItem.props.title).toEqual('title');
    expect(homeFeedItem.props.description).toEqual('description');
    expect(homeFeedItem.props.onPress).toBeDefined();
    expect(homeFeedItem.props.viewStyle).toEqual(viewStyle);
    expect(homeFeedItem.props.testID).toEqual(testIDMock);
  });
  it('calls navigationAction when button is pressed', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };
    const navigateActionMock = jest.fn();

    const testRenderer = renderer.create(
      <ScheduleTestFeedItem
        viewStyle={viewStyle}
        navigateAction={navigateActionMock}
        title={'title'}
        description={'description'}
        serviceType={'serviceType'}
      />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);

    homeFeedItem.props.onPress();
    expect(navigateActionMock).toBeCalledTimes(1);
    expect(navigateActionMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      'serviceType'
    );
  });
});
