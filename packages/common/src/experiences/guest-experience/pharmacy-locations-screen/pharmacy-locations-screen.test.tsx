// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import { PharmacyLocationsScreen } from './pharmacy-locations-screen';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { pharmacyLocationsScreenContent } from './pharmacy-locations-screen.content';
import { pharmacyLocationsScreenStyle as styles } from './pharmacy-locations-screen.style';
import { PharmacyLocationsListConnected } from '../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list.connected';
import { appointmentsStackNavigationMock } from '../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { useNavigation } from '@react-navigation/native';
import { LogoClickActionEnum } from '../../../components/app/application-header/application-header';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list.connected',
  () => ({
    PharmacyLocationsListConnected: () => <div />,
  })
);
jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

describe('PharmacyLocationsScreen', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(appointmentsStackNavigationMock);
  });

  it('renders as BasicPageConnected with expected properties', () => {
    useNavigationMock.mockReturnValue(appointmentsStackNavigationMock);

    const testRenderer = renderer.create(<PharmacyLocationsScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.headerViewStyle).toEqual(
      styles.pharmacyLocationsScreenHeaderViewStyle
    );
    expect(pageProps.hideNavigationMenuButton).toBeFalsy();
    expect(pageProps.showProfileAvatar).toBeTruthy();
    expect(pageProps.logoClickAction).toEqual(LogoClickActionEnum.CONFIRM);
    expect(pageProps.navigateBack).toBe(appointmentsStackNavigationMock.goBack);
    expect(pageProps.translateContent).toBeTruthy();
  });

  it('renders header Text component with expected properties', () => {
    const testRenderer = renderer.create(<PharmacyLocationsScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const headerText = pageProps.header.props.children;

    expect(headerText.type).toEqual(Text);
    expect(headerText.props.style).toEqual(
      styles.pharmacyLocationsHeaderTextStyle
    );
    expect(headerText.props.children).toEqual(
      pharmacyLocationsScreenContent.headerText
    );
  });

  it('renders body with PharmacyLocationsListConnected', () => {
    const testRenderer = renderer.create(<PharmacyLocationsScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    expect(bodyProp.type).toBe(PharmacyLocationsListConnected);
  });
});
