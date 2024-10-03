// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { WaitlistConfirmationScreen } from './waitlist-confirmation-screen';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { waitlistConfirmationScreenContent } from './waitlist-confirmation-screen.content';
import renderer from 'react-test-renderer';
import { SecondaryButton } from '../../../components/buttons/secondary/secondary.button';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { useNavigation, useRoute } from '@react-navigation/native';
import { appointmentsStackNavigationMock } from '../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { resetStackToHome } from '../store/navigation/navigation-reducer.actions';
import { HomeButton } from '../../../components/buttons/home/home.button';
import { View } from 'react-native';
import { getChildren } from '../../../testing/test.helper';

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));
jest.mock('@react-navigation/native');
const routeMock = useRoute as jest.Mock;
const navigationMock = useNavigation as jest.Mock;

jest.mock('../store/navigation/navigation-reducer.actions');
const resetStackToHomeMock = resetStackToHome as jest.Mock;

const routePropsMock = {
  params: {
    serviceType: 'service-type',
    phoneNumber: '+12223334455',
    patientFirstName: 'TEST FIRST',
    patientLastName: 'TEST LAST',
    serviceName: 'service-name',
  },
};

describe('WaitlistConfirmationScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    routeMock.mockReturnValue(routePropsMock);
    navigationMock.mockReturnValue(appointmentsStackNavigationMock);
  });
  it('renders BasicPageConnected with expected properties', () => {
    const testRenderer = renderer.create(<WaitlistConfirmationScreen />);
    const container = testRenderer.root;
    const basicPageConnected = container.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    expect(pageProps.hideNavigationMenuButton).toBeFalsy();
    expect(pageProps.showProfileAvatar).toBeTruthy();
  });

  it('renders home and add another person buttons', () => {
    const testRenderer = renderer.create(<WaitlistConfirmationScreen />);
    const container = testRenderer.root;
    const basicPageConnected = container.findByType(BasicPageConnected);
    const bodyProp = basicPageConnected.props.body;
    const viewParagraph1 = bodyProp.props.children[0];
    const viewParagraph2 = bodyProp.props.children[1];
    const addAnotherPerson = bodyProp.props.children[2];

    expect(bodyProp.type).toBe(BodyContentContainer);
    expect(bodyProp.props.title).toEqual(
      waitlistConfirmationScreenContent.confirmationTitle
    );

    expect(viewParagraph1.type).toBe(View);
    expect(viewParagraph2.type).toBe(View);

    expect(addAnotherPerson.type).toBe(SecondaryButton);
    expect(addAnotherPerson.props.children).toEqual(
      waitlistConfirmationScreenContent.addAnotherPersonLabel
    );

    const homeButton = bodyProp.props.children[3];
    expect(homeButton.type).toBe(HomeButton);
  });

  it('navigates on add another person button press', () => {
    const testRenderer = renderer.create(<WaitlistConfirmationScreen />);
    const container = testRenderer.root;
    const basicPageConnected = container.findByType(BasicPageConnected);
    const bodyProp = basicPageConnected.props.body;
    const addAnotherPerson = bodyProp.props.children[2];

    addAnotherPerson.props.onPress();

    expect(appointmentsStackNavigationMock.navigate).toBeCalledWith(
      'JoinWaitlist',
      {}
    );
  });

  it('navigates on home button press', () => {
    const testRenderer = renderer.create(<WaitlistConfirmationScreen />);
    const container = testRenderer.root;
    const basicPageConnected = container.findByType(BasicPageConnected);
    const bodyProp = basicPageConnected.props.body;
    const homeButton = bodyProp.props.children[3];

    homeButton.props.onPress();
    expect(resetStackToHomeMock).toBeCalledWith(
      appointmentsStackNavigationMock,
      {}
    );
  });

  it('formats phone number and names correctly', () => {
    const testRenderer = renderer.create(<WaitlistConfirmationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPageConnected.props.body;
    const viewParagraph1 = body.props.children[0];
    const confirmationSeg1 = getChildren(viewParagraph1)[0];
    expect(confirmationSeg1.props.children[0]).toEqual('We will text ');
    const nameSegment = getChildren(confirmationSeg1)[1];
    expect(nameSegment.props.children[0]).toEqual('Test First Test Last');
    const confirmationSeg2 = getChildren(nameSegment)[1];
    expect(confirmationSeg2.props.children[0]).toEqual(' at ');
    const phoneSegment = getChildren(confirmationSeg2)[1];
    expect(phoneSegment.props.children[0]).toEqual('222-333-4455');
    const confirmationSeg3 = getChildren(phoneSegment)[1];
    expect(confirmationSeg3.props.children[0]).toEqual(' when a spot for ');
    const serviceNameSegment = getChildren(confirmationSeg3)[1];
    expect(serviceNameSegment.props.children[0]).toEqual('service-name');
    const confirmationSeg4 = getChildren(serviceNameSegment)[1];
    expect(confirmationSeg4.props.children).toEqual(' becomes available.');

    const viewParagraph2 = body.props.children[1];
    const confirmationSeg5 = getChildren(viewParagraph2)[0];
    expect(confirmationSeg5.props.children[0]).toEqual(
      'The text message will include an invitation link for '
    );
    const firstPersonNameSegment = getChildren(confirmationSeg5)[1];
    expect(firstPersonNameSegment.props.children[0]).toEqual('Test First');
    const confirmationSeg6 = getChildren(firstPersonNameSegment)[1];
    expect(confirmationSeg6.props.children).toEqual(
      ' to login to myPrescryptive and schedule an appointment.'
    );
  });

  it('formats phone number and names correctly when it has space', () => {
    const routePropsWithSpaceMock = {
      params: {
        ...routePropsMock.params,
        service: ' TEST FIRST',
        patientLastName: ' TEST LAST',
      },
    };
    routeMock.mockReturnValue(routePropsWithSpaceMock);

    const testRenderer = renderer.create(<WaitlistConfirmationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPageConnected.props.body;
    const viewParagraph1 = body.props.children[0];
    const confirmationSeg1 = getChildren(viewParagraph1)[0];
    expect(confirmationSeg1.props.children[0]).toEqual('We will text ');
    const nameSegment = getChildren(confirmationSeg1)[1];
    expect(nameSegment.props.children[0]).toEqual('Test First Test Last');
    const confirmationSeg2 = getChildren(nameSegment)[1];
    expect(confirmationSeg2.props.children[0]).toEqual(' at ');
    const phoneSegment = getChildren(confirmationSeg2)[1];
    expect(phoneSegment.props.children[0]).toEqual('222-333-4455');
    const confirmationSeg3 = getChildren(phoneSegment)[1];
    expect(confirmationSeg3.props.children[0]).toEqual(' when a spot for ');
    const serviceNameSegment = getChildren(confirmationSeg3)[1];
    expect(serviceNameSegment.props.children[0]).toEqual('service-name');
    const confirmationSeg4 = getChildren(serviceNameSegment)[1];
    expect(confirmationSeg4.props.children).toEqual(' becomes available.');

    const viewParagraph2 = body.props.children[1];
    const confirmationSeg5 = getChildren(viewParagraph2)[0];
    expect(confirmationSeg5.props.children[0]).toEqual(
      'The text message will include an invitation link for '
    );
    const firstPersonNameSegment = getChildren(confirmationSeg5)[1];
    expect(firstPersonNameSegment.props.children[0]).toEqual('Test First');
    const confirmationSeg6 = getChildren(firstPersonNameSegment)[1];
    expect(confirmationSeg6.props.children).toEqual(
      ' to login to myPrescryptive and schedule an appointment.'
    );
  });
});
