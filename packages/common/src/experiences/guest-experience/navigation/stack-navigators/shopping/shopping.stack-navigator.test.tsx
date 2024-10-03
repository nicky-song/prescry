// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../../../testing/test.container';
import { createStackNavigator } from '@react-navigation/stack';
import { ShoppingStackNavigator } from './shopping.stack-navigator';
import { getChildren } from '../../../../../testing/test.helper';
import { ShoppingPickAPharmacyScreen } from '../../../screens/shopping/pick-a-pharmacy/shopping-pick-a-pharmacy.screen';
import { ShoppingConfirmationScreen } from '../../../screens/shopping/confirmation/shopping-confirmation.screen';
import { OrderPreviewScreen } from '../../../screens/shopping/order-preview/order-preview.screen';
import { PricingOptionsScreen } from '../../../screens/shopping/pricing-options/pricing-options.screen';
import { defaultStackNavigationScreenOptions } from '../../navigation.helper';

jest.mock('@react-navigation/stack');
const createStackNavigatorMock = createStackNavigator as jest.Mock;

jest.mock(
  '../../../context-providers/shopping/shopping.context-provider',
  () => ({
    ShoppingContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '../../../screens/shopping/pick-a-pharmacy/shopping-pick-a-pharmacy.screen',
  () => ({
    ShoppingPickAPharmacyScreen: () => <div />,
  })
);

jest.mock(
  '../../../screens/shopping/confirmation/shopping-confirmation.screen',
  () => ({
    ShoppingConfirmationScreen: () => <div />,
  })
);

jest.mock(
  '../../../screens/shopping/order-preview/order-preview.screen',
  () => ({
    OrderPreviewScreen: () => <div />,
  })
);

jest.mock(
  '../../../screens/shopping/pricing-options/pricing-options.screen',
  () => ({
    PricingOptionsScreen: () => <div />,
  })
);

const StackNavigatorMock = {
  Navigator: ({ children }: ITestContainer) => <div>{children}</div>,
  Screen: () => <div />,
};

describe('ShoppingStackNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createStackNavigatorMock.mockReturnValue(StackNavigatorMock);
  });

  it('renders StackNavigator in ShoppingContextProvider', () => {
    const testRenderer = renderer.create(<ShoppingStackNavigator />);

    const stackNavigator = testRenderer.root.findByType(
      StackNavigatorMock.Navigator
    );
    expect(stackNavigator.type).toEqual(StackNavigatorMock.Navigator);
    expect(stackNavigator.props.screenOptions).toEqual(
      defaultStackNavigationScreenOptions
    );
  });

  it('renders screens', () => {
    const expectedScreens = [
      ['ShoppingPickAPharmacy', ShoppingPickAPharmacyScreen],
      ['ShoppingConfirmation', ShoppingConfirmationScreen],
      ['ShoppingOrderPreview', OrderPreviewScreen],
      ['ShoppingPricingOptions', PricingOptionsScreen],
    ];

    const testRenderer = renderer.create(<ShoppingStackNavigator />);

    const stackNavigator = testRenderer.root.findByType(
      StackNavigatorMock.Navigator
    );
    const stackScreens = getChildren(stackNavigator);

    expect(stackScreens.length).toEqual(expectedScreens.length);

    expectedScreens.forEach(([expectedName, expectedComponent], index) => {
      const screen = stackScreens[index];

      expect(screen.type).toEqual(StackNavigatorMock.Screen);
      expect(screen.props.name).toEqual(expectedName);
      expect(screen.props.component).toEqual(expectedComponent);
    });
  });
});
