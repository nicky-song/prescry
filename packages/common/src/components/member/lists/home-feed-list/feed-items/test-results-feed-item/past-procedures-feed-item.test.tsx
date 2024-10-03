// Copyright 2020 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { rootStackNavigationMock } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigatePastProceduresListDispatch } from '../../../../../../experiences/guest-experience/store/navigation/dispatch/navigate-past-procedures-list.dispatch';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { PastProceduresFeedItem } from './past-procedures-feed-item';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../../items/title-description-card-item/title-description-card-item',
  () => ({ TitleDescriptionCardItem: () => <div /> })
);

jest.mock(
  '../../../../../../experiences/guest-experience/store/navigation/dispatch/navigate-past-procedures-list.dispatch'
);
const navigatePastProceduresListDispatchMock =
  navigatePastProceduresListDispatch as jest.Mock;

describe('PastProceduresTestFeedItem', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });
  it('renders in HomeFeedItem with expected properties', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };

    const testRenderer = renderer.create(
      <PastProceduresFeedItem
        viewStyle={viewStyle}
        title={'title'}
        description={'description'}
      />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);
    expect(useNavigationMock).toBeCalledTimes(1);
    expect(homeFeedItem.props.title).toEqual('title');
    expect(homeFeedItem.props.description).toEqual('description');
    expect(homeFeedItem.props.onPress).toBeDefined();
    expect(homeFeedItem.props.viewStyle).toEqual(viewStyle);
  });
  it('navigates on past procedures feed item press', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };

    const testRenderer = renderer.create(
      <PastProceduresFeedItem
        viewStyle={viewStyle}
        title={'title'}
        description={'description'}
      />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);
    homeFeedItem.props.onPress();
    expect(navigatePastProceduresListDispatchMock).toBeCalledTimes(1);
    expect(navigatePastProceduresListDispatchMock).toBeCalledWith(
      rootStackNavigationMock
    );
  });
});
