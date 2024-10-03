// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ITestContainer } from '../../../../../testing/test.container';
import { createStackNavigator } from '@react-navigation/stack';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { getChildren } from '../../../../../testing/test.helper';
import { PrescriptionPersonScreen } from '../../../screens/prescription-person/prescription-person.screen';
import { VerifyPatientInfoScreen } from '../../../screens/verify-patient-info/verify-patient-info.screen';
import { AccountAndFamilyStackNavigator } from './account-and-family.stack-navigator';

jest.mock('@react-navigation/stack');
const createStackNavigatorMock = createStackNavigator as jest.Mock;

jest.mock(
  '../../../screens/prescription-person/prescription-person.screen.tsx',
  () => ({
    PrescriptionPersonScreen: () => <div />,
  })
);

jest.mock(
  '../../../screens/verify-patient-info/verify-patient-info.screen',
  () => ({
    VerifyPatientInfoScreen: () => <div />,
  })
);

const StackNavigatorMock = {
  Navigator: ({ children }: ITestContainer) => <div>{children}</div>,
  Screen: () => <div />,
};

describe('AccountAndFamilyStackNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createStackNavigatorMock.mockReturnValue(StackNavigatorMock);
  });
  it('renders in AccountAndFamilyStackNavigator', () => {
    const testRenderer = renderer.create(<AccountAndFamilyStackNavigator />);

    const stackNavigator = testRenderer.root.children[0] as ReactTestInstance;

    expect(stackNavigator.type).toEqual(StackNavigatorMock.Navigator);
    expect(stackNavigator.props.screenOptions).toEqual(
      defaultStackNavigationScreenOptions
    );
    expect(stackNavigator.props.screenListeners).toEqual(
      defaultScreenListeners
    );
  });
  it('renders expected screens', () => {
    const expectedScreens = [
      ['PrescriptionPerson', PrescriptionPersonScreen],
      ['VerifyPatientInfo', VerifyPatientInfoScreen],
    ];

    const testRenderer = renderer.create(<AccountAndFamilyStackNavigator />);

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
