// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../../../testing/test.container';
import { createStackNavigator } from '@react-navigation/stack';
import { DrugSearchStackNavigator } from './drug-search.stack-navigator';
import { getChildren } from '../../../../../testing/test.helper';
import { DrugSearchHomeScreen } from '../../../screens/drug-search/drug-search-home/drug-search-home.screen';
import { DrugSearchPickAPharmacyScreen } from '../../../screens/drug-search/drug-search-pick-a-pharmacy/drug-search-pick-a-pharmacy.screen';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { PrescriptionTransferConfirmationScreen } from '../../../screens/drug-search/prescription-transfer-confirmation/prescription-transfer-confirmation.screen';
import { VerifyPrescriptionScreen } from '../../../screens/drug-search/verify-prescription/verify-prescription.screen';
import { WhatComesNextScreen } from '../../../screens/drug-search/what-comes-next/what-comes-next.screen';
import { FindYourPharmacyScreen } from '../../../screens/drug-search/find-pharmacy/find-your-pharmacy.screen';
import { ConfigureMedicationScreen } from '../../../screens/drug-search/configure-medication/configure-medication.screen';

jest.mock('@react-navigation/stack');
const createStackNavigatorMock = createStackNavigator as jest.Mock;

jest.mock(
  '../../../context-providers/drug-search/drug-search.context-provider',
  () => ({
    DrugSearchContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '../../../screens/drug-search/drug-search-home/drug-search-home.screen',
  () => ({
    DrugSearchHomeScreen: () => <div />,
  })
);

jest.mock(
  '../../../screens/drug-search/drug-search-pick-a-pharmacy/drug-search-pick-a-pharmacy.screen',
  () => ({
    DrugSearchPickAPharmacyScreen: () => <div />,
  })
);

jest.mock(
  '../../../screens/drug-search/what-comes-next/what-comes-next.screen',
  () => ({
    WhatComesNextScreen: () => <div />,
  })
);
const StackNavigatorMock = {
  Navigator: ({ children }: ITestContainer) => <div>{children}</div>,
  Screen: () => <div />,
};

describe('DrugSearchStackNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createStackNavigatorMock.mockReturnValue(StackNavigatorMock);
  });

  it('renders StackNavigator in DrugSearchContextProvider', () => {
    const testRenderer = renderer.create(<DrugSearchStackNavigator />);

    const stackNavigator = testRenderer.root.findByType(
      StackNavigatorMock.Navigator
    );

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
      ['DrugSearchHome', DrugSearchHomeScreen],
      ['DrugSearchPickAPharmacy', DrugSearchPickAPharmacyScreen],
      ['WhatComesNext', WhatComesNextScreen],
      [
        'PrescriptionTransferConfirmation',
        PrescriptionTransferConfirmationScreen,
      ],
      ['VerifyPrescription', VerifyPrescriptionScreen],
      ['FindYourPharmacy', FindYourPharmacyScreen],
      ['ConfigureMedication', ConfigureMedicationScreen],
    ];

    const testRenderer = renderer.create(<DrugSearchStackNavigator />);

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
