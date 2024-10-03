// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../../../testing/test.container';
import { createStackNavigator } from '@react-navigation/stack';
import { ClaimAlertStackNavigator } from './claim-alert.stack-navigator';
import { getChildren } from '../../../../../testing/test.helper';
import { ConnectedClaimAlertScreen } from '../../../claim-alert-screen/claim-alert-screen.connected';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { RecommendedAlternativesScreen } from '../../../screens/recommended-alternatives/recommended-alternatives.screen';
import { SwitchYourMedicationScreen } from '../../../screens/switch-your-medication/switch-your-medication.screen';
import { GreatPriceScreen } from '../../../screens/great-price/great-price.screen';
import { ClaimExperienceScreen } from '../../../screens/claim-experience/claim-experience.screen';
import { ClaimReversalScreen } from '../../../screens/claim-reversal/claim-reversal.screen';

jest.mock('@react-navigation/stack');
const createStackNavigatorMock = createStackNavigator as jest.Mock;

jest.mock('../../../claim-alert-screen/claim-alert-screen.connected', () => ({
  ConnectedClaimAlertScreen: () => <div />,
}));

jest.mock(
  '../../../screens/recommended-alternatives/recommended-alternatives.screen',
  () => ({
    RecommendedAlternativesScreen: () => <div />,
  })
);

jest.mock(
  '../../../screens/switch-your-medication/switch-your-medication.screen',
  () => ({
    SwitchYourMedicationScreen: () => <div />,
  })
);
jest.mock('../../../screens/great-price/great-price.screen', () => ({
  GreatPriceScreen: () => <div />,
}));

jest.mock('../../../screens/great-price/great-price.screen', () => ({
  GreatPriceScreen: () => <div />,
}));

jest.mock('../../../screens/claim-experience/claim-experience.screen', () => ({
  ClaimExperienceScreen: () => <div />,
}));

jest.mock('../../../screens/claim-reversal/claim-reversal.screen', () => ({
  ClaimReversalScreen: () => <div />,
}));

const StackNavigatorMock = {
  Navigator: ({ children }: ITestContainer) => <div>{children}</div>,
  Screen: () => <div />,
};

describe('ClaimAlertStackNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createStackNavigatorMock.mockReturnValue(StackNavigatorMock);
  });

  it('renders StackNavigator in ClaimAlertContextProvider', () => {
    const testRenderer = renderer.create(<ClaimAlertStackNavigator />);

    const stackNavigator = testRenderer.root.findByType(
      StackNavigatorMock.Navigator
    );

    expect(stackNavigator.props.screenOptions).toEqual(
      defaultStackNavigationScreenOptions
    );
    expect(stackNavigator.props.screenListeners).toEqual(
      defaultScreenListeners
    );
  });

  it('renders screens', () => {
    const expectedScreens = [
      ['ClaimAlert', ConnectedClaimAlertScreen],
      ['RecommendedAlternatives', RecommendedAlternativesScreen],
      ['SwitchYourMedication', SwitchYourMedicationScreen],
      ['GreatPrice', GreatPriceScreen],
      ['ClaimExperience', ClaimExperienceScreen],
      ['ClaimReversal', ClaimReversalScreen],
    ];

    const testRenderer = renderer.create(<ClaimAlertStackNavigator />);

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
