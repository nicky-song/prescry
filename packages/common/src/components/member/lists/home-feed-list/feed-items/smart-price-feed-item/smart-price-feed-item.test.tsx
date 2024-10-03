// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { SmartPriceFeedItem } from './smart-price-feed-item';
import { rootStackNavigationMock } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useNavigation } from '@react-navigation/native';

jest.mock(
  '../../../../items/title-description-card-item/title-description-card-item',
  () => ({
    TitleDescriptionCardItem: () => <div />,
  })
);

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../../../../../components/image-asset/image-asset');

describe('SmartPriceFeedItem', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });
  it('renders in HomeFeedItem with expected properties', () => {
    const viewStyle: StyleProp<ViewStyle> = {
      backgroundColor: 'blue',
    };

    const testRenderer = renderer.create(
      <SmartPriceFeedItem
        viewStyle={viewStyle}
        title={'title'}
        description={'description'}
      />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);
    expect(homeFeedItem.props.title).toEqual('title');
    expect(homeFeedItem.props.description).toEqual('description');
    expect(homeFeedItem.props.onPress).toEqual(expect.any(Function));
    expect(homeFeedItem.props.viewStyle).toEqual(viewStyle);

    homeFeedItem.props.onPress();
    expect(rootStackNavigationMock.navigate).toBeCalledWith('SmartPrice');
  });
});
