// Copyright 2021 Prescryptive Health, Inc.

import {
  EventArg,
  EventMapBase,
  NavigationState,
  ParamListBase,
  PartialState,
  Route,
  ScreenListeners,
} from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { assertIsDefined } from '../../../assertions/assert-is-defined';
import { logNavigationEvent } from '../guest-experience-logger.middleware';
import {
  defaultScreenListeners,
  defaultStackNavigationScreenOptions,
  getCurrentScreen,
  IListenerProps,
  popToTop,
} from './navigation.helper';
import { RootStackParamList } from './stack-navigators/root/root.stack-navigator';
import { rootStackNavigationMock } from './stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../guest-experience-logger.middleware');
const logNavigationEventMock = logNavigationEvent as jest.Mock;

describe('navigationHelper', () => {
  it('defines default stack navigation screen options', () => {
    const expectedOptions: StackNavigationOptions = {
      headerShown: false,
      title:
        'myPrescryptive | Prescription Management, Savings, & Pharmacy Information',
    };
    expect(defaultStackNavigationScreenOptions).toEqual(expectedOptions);
  });

  it('gets current screen', () => {
    const routeIndexMock = 1;
    type NavigationRoute<
      ParamList extends ParamListBase,
      RouteName extends keyof ParamList
    > = Route<Extract<RouteName, string>, ParamList[RouteName]> & {
      state?: NavigationState | PartialState<NavigationState>;
    };
    const routesMock: NavigationRoute<
      RootStackParamList,
      keyof RootStackParamList
    >[] = [
      { key: 'create-account-key-mock', name: 'CreateAccount' },
      { key: 'home-key-mock', name: 'Home' },
      { key: 'unauth-home-key-mock', name: 'UnauthHome' },
    ];
    const navigationStateMock: NavigationState<RootStackParamList> = {
      key: 'home-key',
      index: routeIndexMock,
      routeNames: ['CreateAccount', 'Home', 'UnauthHome'],
      routes: routesMock,
      type: 'stack',
      stale: false,
    };

    (rootStackNavigationMock.getState as jest.Mock).mockReturnValue(
      navigationStateMock
    );

    expect(getCurrentScreen(rootStackNavigationMock)).toEqual(
      navigationStateMock.routes[routeIndexMock].name
    );
  });

  it('gets default screen listeners', () => {
    const routeNameMock = 'route-name';
    const listenerPropsMock: IListenerProps = {
      navigation: jest.fn(),
      route: {
        name: routeNameMock,
        key: 'key',
      },
    };
    const listeners = defaultScreenListeners(listenerPropsMock);

    const expectedListeners: ScreenListeners<NavigationState, EventMapBase> = {
      state: expect.any(Function),
    };
    expect(listeners).toEqual(expectedListeners);

    assertIsDefined(listeners.state);
    listeners.state({} as EventArg<'state'>);
    expect(logNavigationEventMock).toHaveBeenCalledWith(routeNameMock);
  });

  it.each([[false], [true]])(
    'pops to top of stack (canGoBack: %p)',
    (canGoBack: boolean) => {
      const canGoBackMock = rootStackNavigationMock.canGoBack as jest.Mock;
      canGoBackMock.mockReturnValue(canGoBack);

      popToTop(rootStackNavigationMock);

      if (canGoBack) {
        expect(rootStackNavigationMock.popToTop).toHaveBeenCalledWith();
      } else {
        expect(rootStackNavigationMock.popToTop).not.toHaveBeenCalled();
      }
    }
  );
});
