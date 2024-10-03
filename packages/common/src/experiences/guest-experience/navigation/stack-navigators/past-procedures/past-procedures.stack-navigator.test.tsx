// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ITestContainer } from '../../../../../testing/test.container';
import { createStackNavigator } from '@react-navigation/stack';
import { getChildren } from '../../../../../testing/test.helper';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { PastProceduresStackNavigator } from './past-procedures.stack-navigator';
import { PastProceduresListScreen } from '../../../screens/past-procedures-list/past-procedures-list.screen';
import { VaccinationRecordScreenConnected } from '../../../vaccination-record-screen/vaccination-record-screen.connected';
import { TestResultScreenConnected } from '../../../test-result.screen/test-result.screen.connected';
import { PastProceduresContextProvider } from '../../../context-providers/past-procedures/past-procedures.context-provider';

jest.mock('@react-navigation/stack');
const createStackNavigatorMock = createStackNavigator as jest.Mock;

jest.mock(
  '../../../context-providers/past-procedures/past-procedures.context-provider',
  () => ({
    PastProceduresContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '../../../screens/past-procedures-list/past-procedures-list.screen',
  () => ({
    PastProceduresListScreen: () => <div />,
  })
);

jest.mock(
  '../../../vaccination-record-screen/vaccination-record-screen.connected',
  () => ({
    VaccinationRecordScreenConnected: () => <div />,
  })
);

jest.mock('../../../test-result.screen/test-result.screen.connected', () => ({
  TestResultScreenConnected: () => <div />,
}));

const StackNavigatorMock = {
  Navigator: ({ children }: ITestContainer) => <div>{children}</div>,
  Screen: () => <div />,
};

describe('PastProceduresStackNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createStackNavigatorMock.mockReturnValue(StackNavigatorMock);
  });

  it('renders in PastProceduresContextProvider', () => {
    const testRenderer = renderer.create(<PastProceduresStackNavigator />);

    const contextProvider = testRenderer.root.children[0] as ReactTestInstance;

    expect(contextProvider.type).toEqual(PastProceduresContextProvider);
    expect(getChildren(contextProvider).length).toEqual(1);
  });

  it('renders StackNavigator in PastProceduresContextProvider', () => {
    const testRenderer = renderer.create(<PastProceduresStackNavigator />);

    const contextProvider = testRenderer.root.findByType(
      PastProceduresContextProvider
    );
    const stackNavigator = getChildren(contextProvider)[0];

    expect(stackNavigator.type).toEqual(StackNavigatorMock.Navigator);
    expect(stackNavigator.props.screenOptions).toEqual(
      defaultStackNavigationScreenOptions
    );
    expect(stackNavigator.props.screenListeners).toEqual(
      defaultScreenListeners
    );
  });

  it('renders screens', () => {
    const expectedScreens = [
      ['PastProceduresList', PastProceduresListScreen],
      ['VaccinationRecord', VaccinationRecordScreenConnected],
      ['TestResult', TestResultScreenConnected],
    ];

    const testRenderer = renderer.create(<PastProceduresStackNavigator />);

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
