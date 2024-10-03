// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ITestContainer } from '../../../../../testing/test.container';
import { createStackNavigator } from '@react-navigation/stack';
import { AppointmentsStackNavigator } from './appointments.stack-navigator';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
} from '../../navigation.helper';
import { getChildren } from '../../../../../testing/test.helper';
import { JoinWaitlistScreenConnected } from '../../../join-waitlist-screen/join-waitlist-screen.connected';
import { WaitlistConfirmationScreen } from '../../../waitlist-confirmation-screen/waitlist-confirmation-screen';
import { ServiceSelectionScreen } from '../../../service-selection-screen/service-selection-screen';
import { PharmacyLocationsScreen } from '../../../pharmacy-locations-screen/pharmacy-locations-screen';
import { AppointmentScreenConnected } from '../../../appointment-screen/appointment.screen.connected';
import { AppointmentsListScreen } from '../../../appointments-list-screen/appointments-list-screen';
import { AppointmentConfirmationScreenConnected } from '../../../appointment-confirmation.screen/appointment-confirmation.screen.connected';

jest.mock('@react-navigation/stack');
const createStackNavigatorMock = createStackNavigator as jest.Mock;

jest.mock('../../../service-selection-screen/service-selection-screen', () => ({
  ServiceSelectionScreen: () => <div />,
}));

jest.mock(
  '../../../pharmacy-locations-screen/pharmacy-locations-screen',
  () => ({
    PharmacyLocationsScreen: () => <div />,
  })
);
jest.mock('../../../appointment-screen/appointment.screen.connected', () => ({
  AppointmentScreenConnected: () => <div />,
}));

jest.mock(
  '../../../appointment-confirmation.screen/appointment-confirmation.screen.connected',
  () => ({
    AppointmentConfirmationScreenConnected: () => <div />,
  })
);

jest.mock('../../../appointments-list-screen/appointments-list-screen', () => ({
  AppointmentsListScreen: () => <div />,
}));
jest.mock(
  '../../../join-waitlist-screen/join-waitlist-screen.connected',
  () => ({ JoinWaitlistScreenConnected: () => <div /> })
);

jest.mock(
  '../../../waitlist-confirmation-screen/waitlist-confirmation-screen',
  () => ({ WaitlistConfirmationScreen: () => <div /> })
);

const StackNavigatorMock = {
  Navigator: ({ children }: ITestContainer) => <div>{children}</div>,
  Screen: () => <div />,
};

describe('AppointmentsStackNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createStackNavigatorMock.mockReturnValue(StackNavigatorMock);
  });
  it('renders in StackNavigator', () => {
    const testRenderer = renderer.create(<AppointmentsStackNavigator />);

    const stackNavigator = testRenderer.root.children[0] as ReactTestInstance;

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
      ['PharmacyLocations', PharmacyLocationsScreen],
      ['ServiceSelection', ServiceSelectionScreen],
      ['Appointment', AppointmentScreenConnected],
      ['AppointmentsList', AppointmentsListScreen],
      ['AppointmentConfirmation', AppointmentConfirmationScreenConnected],
      ['JoinWaitlist', JoinWaitlistScreenConnected],
      ['WaitlistConfirmation', WaitlistConfirmationScreen],
    ];

    const testRenderer = renderer.create(<AppointmentsStackNavigator />);

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
