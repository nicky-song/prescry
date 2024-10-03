// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { AppointmentsListScreen } from './appointments-list-screen';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { appointmentsListScreenStyles } from './appointments-list-screen.styles';
import {
  AppointmentsList,
  IAppointmentType,
} from '../../../components/member/lists/appointments-list/appointments-list';
import { IAppointmentListItem } from '../../../models/api-response/appointment.response';
import { getChildren } from '../../../testing/test.helper';
import { appointmentsListScreenContent } from './appointments-list-screen.content';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { useAppointmentsListContext } from '../context-providers/appointments-list/appointments-list-context.hook';
import { appointmentsListMock } from '../__mocks__/appointments-list.mock';
import { navigateHomeScreenNoApiRefreshDispatch } from '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IReduxContext } from '../context-providers/redux/redux.context';
import { Heading } from '../../../components/member/heading/heading';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { useUrl } from '../../../hooks/use-url';

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);

jest.mock('../store/navigation/dispatch/navigate-home-screen.dispatch');
jest.mock('../context-providers/redux/use-redux-context.hook');
jest.mock('../store/navigation/dispatch/navigate-open-sidemenu.dispatch');
jest.mock(
  '../context-providers/appointments-list/appointments-list-context.hook'
);

jest.mock('../../../components/image-asset/image-asset');
jest.mock('../../../components/pages/basic-page-connected');
jest.mock('@react-navigation/native');

const useAppointmentsListContextMock = useAppointmentsListContext as jest.Mock;
const appointmentsTypeMock = 'upcoming' as IAppointmentType;
const appointmentsMock = [] as IAppointmentListItem[];

const useReduxContextMock = useReduxContext as jest.Mock;
const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();

const navigateHomeScreenDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../hooks/use-url');
const useUrlMock = useUrl as jest.Mock;

describe('AppointmentsListScreen ', () => {
  beforeEach(() => {
    const reduxContextMock: IReduxContext = {
      getState: reduxGetStateMock,
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useAppointmentsListContextMock.mockReturnValueOnce({
      appointmentsListState: {
        appointmentsType: appointmentsTypeMock,
        appointments: appointmentsMock,
      },
    });
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: undefined });
  });

  it('renders as BasicPageConnected with expected properties', () => {
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.headerViewStyle).toEqual(
      appointmentsListScreenStyles.headerViewStyle
    );
    expect(pageProps.hideNavigationMenuButton).toBeFalsy();
    expect(pageProps.showProfileAvatar).toBeTruthy();
    expect(pageProps.navigateBack).toBeDefined();
    expect(pageProps.translateContent).toBeTruthy();
  });

  it('renders as BasicPageConnected with handleHomeScreenNoApiRefreshDispatch navigateBack if backToHome is true', () => {
    useRouteMock.mockReturnValue({ params: { backToHome: true } });
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    pageProps.navigateBack();
    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledTimes(1);
    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      reduxGetStateMock,
      rootStackNavigationMock
    );
  });

  it('renders as BasicPageConnected with navigation.goback if backToHome is false', () => {
    useRouteMock.mockReturnValue({ params: { backToHome: false } });
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    pageProps.navigateBack();
    expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
  });

  it('renders header', () => {
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const header = pageProps.header;

    expect(header.type).toEqual(Heading);
    expect(header.props.textStyle).toEqual(
      appointmentsListScreenStyles.headerTextStyle
    );
    expect(getChildren(header).length).toBe(1);
    expect(getChildren(header)[0]).toEqual(
      appointmentsListScreenContent.headerText
    );
  });

  it('renders body with AppointmentsListConnected', () => {
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    expect(bodyProp.type).toBe(AppointmentsList);
    expect(bodyProp.props.navigation).toEqual(rootStackNavigationMock);
  });

  it('update url with /appointments', () => {
    renderer.create(<AppointmentsListScreen />);

    expect(useUrlMock).toHaveBeenCalledWith('/appointments');
  });

  it('renders button in footer if appointments exist and type is upcoming', () => {
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const button = pageProps.footer;

    expect(button.type).toEqual(BaseButton);
    expect(getChildren(button).length).toEqual(1);
    expect(getChildren(button)[0]).toEqual(
      appointmentsListScreenContent.scheduleAppointmentButtonText
    );
  });

  it('on press button in footer navigates correctly', () => {
    useAppointmentsListContextMock.mockReturnValueOnce({
      appointmentsListState: {
        appointmentsType: appointmentsTypeMock,
        appointments: undefined,
      },
    });
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const button = pageProps.footer;

    button.props.onPress();

    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      reduxGetStateMock,
      rootStackNavigationMock
    );
  });

  it('does not render footer if appointments do not exist and type is not upcoming', () => {
    useAppointmentsListContextMock.mockReset();
    useAppointmentsListContextMock.mockReturnValueOnce({
      appointmentsListState: {
        appointmentsType: 'cancelled' as IAppointmentType,
        appointments: undefined,
      },
    });
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const footer = pageProps.footer;

    expect(footer).toBeNull();
  });

  it('does not render footer if appointments exist', () => {
    useAppointmentsListContextMock.mockReset();
    useAppointmentsListContextMock.mockReturnValueOnce({
      appointmentsListState: {
        appointmentsType: 'cancelled' as IAppointmentType,
        appointments: appointmentsListMock,
      },
    });
    const testRenderer = renderer.create(<AppointmentsListScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const footer = pageProps.footer;

    expect(footer).toBeNull();
  });
});
