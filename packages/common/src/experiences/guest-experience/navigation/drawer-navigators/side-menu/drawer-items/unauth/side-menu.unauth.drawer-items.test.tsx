// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { IPhoneNumberLoginScreenRouteProps } from '../../../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import { IPbmMemberBenefitsScreenRouteProps } from '../../../../../screens/unauth/pbm-member-benefits/pbm-member-benefits.screen';
import { sideMenuDrawerNavigationMock } from '../../__mocks__/side-menu.drawer-navigation.mock';
import { SideMenuDrawerItem } from '../side-menu.drawer-item';
import { LanguageSideMenuDrawerItem } from '../language.side-menu.drawer-item';
import { SideMenuUnauthDrawerItems } from './side-menu.unauth.drawer-items';
import { useContent } from '../../../../../context-providers/session/ui-content-hooks/use-content';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useSessionContext } from '../../../../../context-providers/session/use-session-context.hook';
import { LineSeparator } from '../../../../../../../components/member/line-separator/line-separator';
import { sideMenuDrawerItemStyles } from '../side-menu.drawer-item.styles';
import { Language } from '../../../../../../../models/language';
import { isDesktopDevice } from '../../../../../../../utils/responsive-screen.helper';
import { setIsGettingStartedModalOpenDispatch } from '../../../../../state/session/dispatch/set-is-getting-started-modal.dispatch';

jest.mock('../../../../../../../utils/responsive-screen.helper');
const isDesktopDeviceMock = isDesktopDevice as jest.Mock;

jest.mock(
  '../../../../../state/session/dispatch/set-is-getting-started-modal.dispatch'
);
const setIsGettingStartedModalOpenDispatchMock =
  setIsGettingStartedModalOpenDispatch as jest.Mock;

jest.mock(
  '../../../../../context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../side-menu.drawer-item', () => ({
  SideMenuDrawerItem: () => <div />,
}));

jest.mock('../language.side-menu.drawer-item', () => ({
  LanguageSideMenuDrawerItem: () => <div />,
}));

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock('../../../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

describe('SideMenuUnauthDrawerItems', () => {
  const createAccountDrawerItemLabelMock =
    'create-account-drawer-item-label-mock';
  const joinEmployerPlanDrawerItemLabelMock =
    'join-employer-plan-drawer-item-label-mock';
  const contactUsDrawerItemLabelMock = 'contact-us-drawer-item-label-mock';
  const languageDrawerItemLabelMock = 'language-drawer-item-label-mock';

  const ldFlagsMock = {
    uselangselector: false,
  };

  const currentLanguageMock: Language = 'English';
  const sessionDispatchMock = jest.fn();
  const sessionStateMock = {
    sessionState: {
      currentLanguage: currentLanguageMock,
    },
    sessionDispatch: sessionDispatchMock,
  };
  const drawerPropsMock = {
    navigation: sideMenuDrawerNavigationMock,
  } as unknown as DrawerContentComponentProps;

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    useContentMock.mockReturnValue({
      content: {
        createAccountDrawerItemLabel: createAccountDrawerItemLabelMock,
        joinEmployerPlanDrawerItemLabel: joinEmployerPlanDrawerItemLabelMock,
        contactUsDrawerItemLabel: contactUsDrawerItemLabelMock,
        languageDrawerItemLabel: languageDrawerItemLabelMock,
      },
      isContentLoading: false,
    });

    useFlagsMock.mockReturnValue(ldFlagsMock);

    useSessionContextMock.mockReturnValue(sessionStateMock);

    isDesktopDeviceMock.mockReturnValue(false);
  });

  it('renders expected number of drawer items', () => {
    useFlagsMock.mockReset();
    useFlagsMock.mockReturnValue({ uselangselector: true });

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    expect(testRenderer.root.children.length).toEqual(5);
  });

  it('renders "Create account" item', () => {
    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.children[0] as ReactTestInstance;

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.label).toEqual(createAccountDrawerItemLabelMock);
    expect(item.props.iconName).toEqual('user');
    expect(item.props.iconSize).toEqual(17);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
    expect(item.props.testID).toEqual('createAccountDrawerItem');
  });

  it('handles "Create account" item press', () => {
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.findAllByType(SideMenuDrawerItem)[0];
    item.props.onPress();

    const expectedParams: IPhoneNumberLoginScreenRouteProps = {
      hasNavigateBack: true,
    };
    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'PhoneNumberLogin',
        params: expectedParams,
      }
    );
    expect(setIsGettingStartedModalOpenDispatchMock).not.toHaveBeenCalled();
    expect(drawerPropsMock.navigation.closeDrawer).not.toHaveBeenCalled();
  });

  it('"Create account" item press closes drawer and opens modal when isDesktopDevice true', () => {
    isDesktopDeviceMock.mockReturnValue(true);
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.findAllByType(SideMenuDrawerItem)[0];
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).not.toHaveBeenCalled();
    expect(setIsGettingStartedModalOpenDispatchMock).toHaveBeenCalledTimes(1);
    expect(setIsGettingStartedModalOpenDispatchMock).toHaveBeenNthCalledWith(
      1,
      sessionDispatchMock,
      true
    );
    expect(drawerPropsMock.navigation.closeDrawer).toHaveBeenCalledTimes(1);
  });

  it('renders "Join employer plan" item', () => {
    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.children[1] as ReactTestInstance;

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.label).toEqual(joinEmployerPlanDrawerItemLabelMock);
    expect(item.props.iconName).toEqual('user-check');
    expect(item.props.iconSize).toEqual(17);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
  });

  it('handles "Join employer plan" item press', () => {
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.findAllByType(SideMenuDrawerItem)[1];
    item.props.onPress();

    const expectedParams: IPbmMemberBenefitsScreenRouteProps = {
      showBackButton: true,
    };
    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'PbmMemberBenefits',
        params: expectedParams,
      }
    );
    expect(setIsGettingStartedModalOpenDispatchMock).not.toHaveBeenCalled();
    expect(drawerPropsMock.navigation.closeDrawer).not.toHaveBeenCalled();
  });

  it('"Join employer plan" item press closes drawer and opens modal when isDesktopDevice true', () => {
    isDesktopDeviceMock.mockReturnValue(true);
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.findAllByType(SideMenuDrawerItem)[1];
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).not.toHaveBeenCalled();
    expect(setIsGettingStartedModalOpenDispatchMock).toHaveBeenCalledTimes(1);
    expect(setIsGettingStartedModalOpenDispatchMock).toHaveBeenNthCalledWith(
      1,
      sessionDispatchMock,
      true
    );
    expect(drawerPropsMock.navigation.closeDrawer).toHaveBeenCalledTimes(1);
  });

  it('renders "Contact us" item', () => {
    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.children[2] as ReactTestInstance;

    expect(item.type).toEqual(SideMenuDrawerItem);
    expect(item.props.label).toEqual(contactUsDrawerItemLabelMock);
    expect(item.props.iconName).toEqual('headphones');
    expect(item.props.iconSize).toEqual(18);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
  });

  it('handles "Contact us" item press', () => {
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.findAllByType(SideMenuDrawerItem)[2];
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'Support',
        params: {},
      }
    );
    expect(setIsGettingStartedModalOpenDispatchMock).not.toHaveBeenCalled();
    expect(drawerPropsMock.navigation.closeDrawer).not.toHaveBeenCalled();
  });

  it('"Contact us" item press navigates to SupportScreen even when isDesktopDevice true', () => {
    isDesktopDeviceMock.mockReturnValue(true);
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.findAllByType(SideMenuDrawerItem)[2];
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'Support',
        params: {},
      }
    );
    expect(setIsGettingStartedModalOpenDispatchMock).not.toHaveBeenCalled();
    expect(drawerPropsMock.navigation.closeDrawer).not.toHaveBeenCalled();
  });

  it('renders "Language" item', () => {
    useFlagsMock.mockReset();
    useFlagsMock.mockReturnValue({ uselangselector: true });

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const divider = testRenderer.root.children[3] as ReactTestInstance;
    const item = testRenderer.root.children[4] as ReactTestInstance;

    expect(divider.type).toBe(LineSeparator);
    expect(divider.props.viewStyle).toEqual(
      sideMenuDrawerItemStyles.lineSeparatorViewStyle
    );
    expect(item.type).toEqual(LanguageSideMenuDrawerItem);
    expect(item.props.label).toEqual(languageDrawerItemLabelMock);
    expect(item.props.languageName).toEqual(currentLanguageMock);
    expect(item.props.onPress).toEqual(expect.any(Function));
    expect(item.props.isSkeleton).toEqual(false);
  });

  it('handles "Language" item press', () => {
    useFlagsMock.mockReset();
    useFlagsMock.mockReturnValue({ uselangselector: true });
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.findAllByType(LanguageSideMenuDrawerItem)[0];
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'SelectLanguage',
        params: {},
      }
    );
    expect(setIsGettingStartedModalOpenDispatchMock).not.toHaveBeenCalled();
    expect(drawerPropsMock.navigation.closeDrawer).not.toHaveBeenCalled();
  });

  it('"Language" item press navigates to SelectLanguageScreen even when isDesktopDevice true', () => {
    useFlagsMock.mockReset();
    useFlagsMock.mockReturnValue({ uselangselector: true });
    isDesktopDeviceMock.mockReturnValue(true);
    useNavigationMock.mockReturnValue(sideMenuDrawerNavigationMock);

    const testRenderer = renderer.create(
      <SideMenuUnauthDrawerItems {...drawerPropsMock} />
    );

    const item = testRenderer.root.findAllByType(LanguageSideMenuDrawerItem)[0];
    item.props.onPress();

    expect(sideMenuDrawerNavigationMock.navigate).toHaveBeenCalledWith(
      'RootStack',
      {
        screen: 'SelectLanguage',
        params: {},
      }
    );
    expect(setIsGettingStartedModalOpenDispatchMock).not.toHaveBeenCalled();
    expect(drawerPropsMock.navigation.closeDrawer).not.toHaveBeenCalled();
  });
});
