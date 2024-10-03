// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { MedicineCabinetFeedItem } from './medicine-cabinet-feed-item';
import { IFeedContext } from '../../../../../../models/api-response/feed-response';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { useReduxContext } from '../../../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../../../../experiences/guest-experience/context-providers/redux/redux.context';
import { medicineCabinetNavigateDispatch } from '../../../../../../experiences/guest-experience/store/navigation/dispatch/medicine-cabinet-navigate.dispatch';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../../items/title-description-card-item/title-description-card-item',
  () => ({
    TitleDescriptionCardItem: () => <div />,
  })
);

jest.mock(
  '../../../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
jest.mock(
  '../../../../../../experiences/guest-experience/store/navigation/dispatch/medicine-cabinet-navigate.dispatch'
);

const medicineCabinetNavigateDispatchMock =
  medicineCabinetNavigateDispatch as jest.Mock;

const useReduxContextMock = useReduxContext as jest.Mock;

describe('MedicineCabinetFeedItem', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });

  it('renders in HomeFeedItem with expected properties', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };

    const feedContext = {
      defaultContext: {
        title: 'Medicine cabinet',
        description: 'View your prescriptions',
      },
    } as IFeedContext;

    const testRenderer = renderer.create(
      <MedicineCabinetFeedItem viewStyle={viewStyle} context={feedContext} />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);
    homeFeedItem.props.onPress();
    expect(medicineCabinetNavigateDispatchMock).toBeCalledWith(
      rootStackNavigationMock
    );
    expect(homeFeedItem.props.viewStyle).toEqual(viewStyle);

    homeFeedItem.props.onPress();

    expect(medicineCabinetNavigateDispatch).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
