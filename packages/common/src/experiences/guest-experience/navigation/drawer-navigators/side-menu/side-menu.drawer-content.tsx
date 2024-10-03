// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, useEffect } from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { SideMenuFooter } from '../../../../../components/member/side-menu-footer/side-menu.footer';
import { SideMenuHeader } from '../../../../../components/member/side-menu-header/side-menu-header';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { MemberNameFormatter } from '../../../../../utils/formatters/member-name-formatter';
import { isDesktopDevice } from '../../../../../utils/responsive-screen.helper';
import { setIsGettingStartedModalOpenDispatch } from '../../../state/session/dispatch/set-is-getting-started-modal.dispatch';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { SideMenuDrawerNavigationProp } from './side-menu.drawer-navigator';
import { IPhoneNumberLoginScreenRouteProps } from '../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import { SideMenuUnauthDrawerItems } from './drawer-items/unauth/side-menu.unauth.drawer-items';
import { sideMenuDrawerContentStyles } from './side-menu.drawer-content.styles';
import { SideMenuAuthDrawerItems } from './drawer-items/auth/side-menu.auth.drawer-items';
import { useDrawerContext } from '../../../context-providers/drawer/drawer.context.hook';
import { setDrawerClosedDispatch } from '../../../state/drawer/dispatch/set-drawer-closed.dispatch';
import { useDrawerStatus } from '@react-navigation/drawer';

export const SideMenuDrawerContent = (
  props: DrawerContentComponentProps
): ReactElement => {
  const { navigation } = props;
  const {
    sessionState: { isUserAuthenticated },
    sessionDispatch,
  } = useSessionContext();

  const { membershipState } = useMembershipContext();

  const {
    drawerState: { status },
    drawerDispatch,
  } = useDrawerContext();

  const isDrawerOpen = status === 'open';

  const drawerStatus = useDrawerStatus();

  useEffect(() => {
    if (drawerStatus !== 'open' && isDrawerOpen) {
      setDrawerClosedDispatch(drawerDispatch);
    }
  }, [drawerStatus]);

  const { firstName, lastName } = membershipState.account;

  const memberProfileName = MemberNameFormatter.formatName(firstName, lastName);

  const onSignInPress = isUserAuthenticated
    ? undefined
    : () => {
        if (isDesktopDevice()) {
          setIsGettingStartedModalOpenDispatch(sessionDispatch, true);
          navigation.closeDrawer();
        } else {
          guestExperienceCustomEventLogger(
            CustomAppInsightEvents.USER_CLICKED_ON_SIDEMENU_SIGNIN,
            {}
          );

          const screenProps: IPhoneNumberLoginScreenRouteProps = {
            hasNavigateBack: true,
          };

          (navigation as unknown as SideMenuDrawerNavigationProp).navigate(
            'RootStack',
            { screen: 'PhoneNumberLogin', params: screenProps }
          );
        }
      };

  const drawerItems = isUserAuthenticated ? (
    <SideMenuAuthDrawerItems />
  ) : (
    <SideMenuUnauthDrawerItems {...props} />
  );

  return isDrawerOpen ? (
    <>
      <SideMenuHeader
        isUserAuthenticated={isUserAuthenticated}
        memberProfileName={memberProfileName}
        onCloseSideMenu={navigation.closeDrawer}
        onSignInPress={onSignInPress}
      />
      <DrawerContentScrollView
        {...props}
        style={sideMenuDrawerContentStyles.scrollViewStyle}
      >
        {drawerItems}
      </DrawerContentScrollView>
      <SideMenuFooter />
    </>
  ) : (
    <></>
  );
};
