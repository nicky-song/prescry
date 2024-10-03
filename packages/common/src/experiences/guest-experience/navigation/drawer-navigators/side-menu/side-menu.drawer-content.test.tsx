// Copyright 2022 Prescryptive Health, Inc.

import React, { useEffect } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { SideMenuDrawerContent } from './side-menu.drawer-content';
import { getChildren } from '../../../../../testing/test.helper';
import { ITestContainer } from '../../../../../testing/test.container';
import { SideMenuFooter } from '../../../../../components/member/side-menu-footer/side-menu.footer';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { ISessionContext } from '../../../context-providers/session/session.context';
import {
  defaultSessionState,
  ISessionState,
} from '../../../state/session/session.state';
import { IMembershipContext } from '../../../context-providers/membership/membership.context';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../../state/membership/membership.state';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { SideMenuHeader } from '../../../../../components/member/side-menu-header/side-menu-header';
import { sideMenuDrawerNavigationMock } from './__mocks__/side-menu.drawer-navigation.mock';
import { MemberNameFormatter } from '../../../../../utils/formatters/member-name-formatter';
import { ILimitedAccount } from '../../../../../models/member-profile/member-profile-info';
import { isDesktopDevice } from '../../../../../utils/responsive-screen.helper';
import { setIsGettingStartedModalOpenDispatch } from '../../../state/session/dispatch/set-is-getting-started-modal.dispatch';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { IPhoneNumberLoginScreenRouteProps } from '../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import { SideMenuUnauthDrawerItems } from './drawer-items/unauth/side-menu.unauth.drawer-items';
import { sideMenuDrawerContentStyles } from './side-menu.drawer-content.styles';
import { SideMenuAuthDrawerItems } from './drawer-items/auth/side-menu.auth.drawer-items';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useDrawerContext } from '../../../context-providers/drawer/drawer.context.hook';
import { setDrawerClosedDispatch } from '../../../state/drawer/dispatch/set-drawer-closed.dispatch';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../../context-providers/drawer/drawer.context.hook');
const useDrawerContextMock = useDrawerContext as jest.Mock;

jest.mock('../../../state/drawer/dispatch/set-drawer-closed.dispatch');
const setDrawerClosedDispatchMock = setDrawerClosedDispatch as jest.Mock;

jest.mock('@react-navigation/drawer', () => ({
  DrawerContentScrollView: ({ children }: ITestContainer) => (
    <div>{children}</div>
  ),
  useDrawerStatus: jest.fn(),
}));
const useDrawerStatusMock = useDrawerStatus as jest.Mock;

jest.mock(
  '../../../../../components/member/side-menu-header/side-menu-header',
  () => ({
    SideMenuHeader: () => <div />,
  })
);

jest.mock('./drawer-items/unauth/side-menu.unauth.drawer-items', () => ({
  SideMenuUnauthDrawerItems: () => <div />,
}));

jest.mock('./drawer-items/auth/side-menu.auth.drawer-items', () => ({
  SideMenuAuthDrawerItems: () => <div />,
}));

jest.mock(
  '../../../../../components/member/side-menu-footer/side-menu.footer',
  () => ({
    SideMenuFooter: () => <div />,
  })
);

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../../utils/responsive-screen.helper');
const isDesktopDeviceMock = isDesktopDevice as jest.Mock;

jest.mock(
  '../../../state/session/dispatch/set-is-getting-started-modal.dispatch'
);
const setIsGettingStartedModalOpenDispatchMock =
  setIsGettingStartedModalOpenDispatch as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

describe('SideMenuDrawerContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const membershipContextMock: IMembershipContext = {
      membershipDispatch: jest.fn(),
      membershipState: defaultMembershipState,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);
    useDrawerStatusMock.mockReturnValue('open');
    useDrawerContextMock.mockReturnValue({
      drawerState: { status: 'open' },
      drawerDispatch: jest.fn(),
    });
  });

  it('renders expected number of children', () => {
    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    expect(testRenderer.root.children.length).toEqual(3);
  });

  it('renders empty fragment when drawer is closed', () => {
    useDrawerContextMock.mockReturnValueOnce({
      drawerState: { status: 'closed' },
    });
    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    expect(testRenderer.root.children).toEqual([]);
  });

  it('calls setDrawerClosedDispatch when drawer is closed', () => {
    const dispatchMock = jest.fn();
    useDrawerContextMock.mockReturnValueOnce({
      drawerState: { status: 'open' },
      drawerDispatch: dispatchMock,
    });
    useDrawerStatusMock.mockReturnValueOnce('closed');
    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    renderer.create(<SideMenuDrawerContent {...drawerPropsMock} />);

    const useEffectCalls = useEffectMock.mock.calls[0];
    const useEffectFunction = useEffectCalls[0];
    const drawerStatus = useEffectCalls[1][0];

    expect(drawerStatus).toEqual('closed');

    useEffectFunction();

    expect(setDrawerClosedDispatchMock).toHaveBeenCalledWith(dispatchMock);
  });
  it('renders header', () => {
    const isUserAuthenticatedMock = true;
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: isUserAuthenticatedMock,
    };
    const sessionContextMock: Partial<ISessionContext> = {
      sessionState: sessionStateMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const firstNameMock = 'first';
    const lastNameMock = 'last';
    const membershipStateMock: Partial<IMembershipState> = {
      account: {
        firstName: firstNameMock,
        lastName: lastNameMock,
      } as ILimitedAccount,
    };
    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: membershipStateMock as IMembershipState,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);

    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    const header = testRenderer.root.children[0] as ReactTestInstance;

    expect(header.type).toEqual(SideMenuHeader);
    expect(header.props.isUserAuthenticated).toEqual(isUserAuthenticatedMock);
    expect(header.props.memberProfileName).toEqual(
      MemberNameFormatter.formatName(firstNameMock, lastNameMock)
    );
    expect(header.props.onCloseSideMenu).toEqual(
      sideMenuDrawerNavigationMock.closeDrawer
    );
  });

  it('provides no Sign In press handler for authenticated users', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: true,
    };
    const sessionContextMock: Partial<ISessionContext> = {
      sessionState: sessionStateMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    const header = testRenderer.root.findByType(SideMenuHeader);

    expect(header.props.onSignInPress).toEqual(undefined);
  });

  it('provides Sign In press handler (desktop)', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: false,
    };
    const sessionDispatchMock = jest.fn();
    const sessionContextMock: Partial<ISessionContext> = {
      sessionState: sessionStateMock,
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    isDesktopDeviceMock.mockReturnValue(true);

    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    const header = testRenderer.root.findByType(SideMenuHeader);

    expect(header.props.onSignInPress).toEqual(expect.any(Function));

    header.props.onSignInPress();

    expect(setIsGettingStartedModalOpenDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      true
    );
    expect(drawerPropsMock.navigation.closeDrawer).toHaveBeenCalledWith();
  });

  it('provides Sign In press handler (mobile)', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: false,
    };
    const sessionDispatchMock = jest.fn();
    const sessionContextMock: Partial<ISessionContext> = {
      sessionState: sessionStateMock,
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    isDesktopDeviceMock.mockReturnValue(false);

    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    const header = testRenderer.root.findByType(SideMenuHeader);

    expect(header.props.onSignInPress).toEqual(expect.any(Function));

    header.props.onSignInPress();

    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.USER_CLICKED_ON_SIDEMENU_SIGNIN,
      {}
    );

    const expectedScreenProps: IPhoneNumberLoginScreenRouteProps = {
      hasNavigateBack: true,
    };
    expect(drawerPropsMock.navigation.navigate).toHaveBeenCalledWith(
      'RootStack',
      { screen: 'PhoneNumberLogin', params: expectedScreenProps }
    );
  });

  it('renders content scroll view', () => {
    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    const scrollView = testRenderer.root.children[1] as ReactTestInstance;

    expect(scrollView.type).toEqual(DrawerContentScrollView);

    const propsWithouChildren = { ...scrollView.props };
    delete propsWithouChildren.children;
    expect(propsWithouChildren).toEqual({
      ...drawerPropsMock,
      style: sideMenuDrawerContentStyles.scrollViewStyle,
    });
    expect(getChildren(scrollView).length).toEqual(1);
  });

  it('renders drawer item list (unauth)', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: false,
    };
    const sessionDispatchMock = jest.fn();
    const sessionContextMock: Partial<ISessionContext> = {
      sessionState: sessionStateMock,
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    const scrollView = testRenderer.root.findByType(DrawerContentScrollView);
    const itemList = getChildren(scrollView)[0];

    expect(itemList.type).toEqual(SideMenuUnauthDrawerItems);
    expect(itemList.props).toEqual(drawerPropsMock);
  });

  it('renders drawer item list (auth)', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: true,
    };
    const sessionDispatchMock = jest.fn();
    const sessionContextMock: Partial<ISessionContext> = {
      sessionState: sessionStateMock,
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    const scrollView = testRenderer.root.findByType(DrawerContentScrollView);
    const itemList = getChildren(scrollView)[0];

    expect(itemList.type).toEqual(SideMenuAuthDrawerItems);
  });

  it('renders footer', () => {
    const drawerPropsMock = {
      navigation: sideMenuDrawerNavigationMock,
    } as unknown as DrawerContentComponentProps;
    const testRenderer = renderer.create(
      <SideMenuDrawerContent {...drawerPropsMock} />
    );

    const footer = testRenderer.root.children[2] as ReactTestInstance;

    expect(footer.type).toEqual(SideMenuFooter);
  });
});
