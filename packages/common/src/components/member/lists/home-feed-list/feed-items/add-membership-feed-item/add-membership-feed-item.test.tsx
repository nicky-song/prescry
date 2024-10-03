// Copyright 2020 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { rootStackNavigationMock } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { AddMembershipFeedItem } from './add-membership-feed-item';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../../items/title-description-card-item/title-description-card-item',
  () => ({
    TitleDescriptionCardItem: () => <div />,
  })
);

describe('AddMembershipFeedItem', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });

  it('renders in HomeFeedItem with expected properties', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };

    const testRenderer = renderer.create(
      <AddMembershipFeedItem
        viewStyle={viewStyle}
        title='title'
        description='description'
      />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);

    expect(homeFeedItem.props.title).toEqual('title');
    expect(homeFeedItem.props.description).toEqual('description');
    expect(homeFeedItem.props.onPress).toEqual(expect.any(Function));
    expect(homeFeedItem.props.viewStyle).toEqual(viewStyle);
    expect(homeFeedItem.props.testID).toEqual(
      'homeFeedItem-addMembershipFeedItem'
    );

    homeFeedItem.props.onPress();

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('Login', {});
  });
});
