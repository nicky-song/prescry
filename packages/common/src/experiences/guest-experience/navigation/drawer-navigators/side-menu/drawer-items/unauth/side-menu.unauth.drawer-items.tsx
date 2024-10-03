// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { RootStackScreenName } from '../../../../stack-navigators/root/root.stack-navigator';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { SideMenuDrawerNavigationProp } from '../../side-menu.drawer-navigator';
import { IPhoneNumberLoginScreenRouteProps } from '../../../../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import { SideMenuDrawerItem } from '../side-menu.drawer-item';
import { LanguageSideMenuDrawerItem } from '../language.side-menu.drawer-item';
import { IPbmMemberBenefitsScreenRouteProps } from '../../../../../screens/unauth/pbm-member-benefits/pbm-member-benefits.screen';
import { useContent } from '../../../../../context-providers/session/ui-content-hooks/use-content';
import { ISideMenuContent } from '../../side-menu.content';
import { CmsGroupKey } from '../../../../../state/cms-content/cms-group-key';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useSessionContext } from '../../../../../context-providers/session/use-session-context.hook';
import { LineSeparator } from '../../../../../../../components/member/line-separator/line-separator';
import { sideMenuDrawerItemStyles } from '../side-menu.drawer-item.styles';
import { Language } from '../../../../../../../models/language';
import { isDesktopDevice } from '../../../../../../../utils/responsive-screen.helper';
import { setIsGettingStartedModalOpenDispatch } from '../../../../../state/session/dispatch/set-is-getting-started-modal.dispatch';

export const SideMenuUnauthDrawerItems = (
  props: DrawerContentComponentProps
): ReactElement => {
  const { navigation: drawerNavigation } = props;

  const navigation = useNavigation<SideMenuDrawerNavigationProp>();

  const { content, isContentLoading } = useContent<ISideMenuContent>(
    CmsGroupKey.sideMenu,
    2
  );
  const { uselangselector } = useFlags();

  const { sessionState, sessionDispatch } = useSessionContext();

  const getScreenRouteProps = (screenName: RootStackScreenName): unknown => {
    switch (screenName) {
      case 'PhoneNumberLogin': {
        const params: IPhoneNumberLoginScreenRouteProps = {
          hasNavigateBack: true,
        };
        return params;
      }
      case 'PbmMemberBenefits': {
        const pbmScreenParams: IPbmMemberBenefitsScreenRouteProps = {
          showBackButton: true,
        };
        return pbmScreenParams;
      }
      default:
        return {};
    }
  };

  const onItemPress = (screenName: RootStackScreenName) => () => {
    if (
      isDesktopDevice() &&
      screenName !== 'SelectLanguage' &&
      screenName !== 'Support'
    ) {
      setIsGettingStartedModalOpenDispatch(sessionDispatch, true);
      drawerNavigation.closeDrawer();
    } else {
      navigation.navigate('RootStack', {
        screen: screenName,
        params: getScreenRouteProps(screenName),
      });
    }
  };

  const languageName: Language = sessionState.currentLanguage;

  return (
    <>
      <SideMenuDrawerItem
        label={content.createAccountDrawerItemLabel}
        iconName='user'
        iconSize={17}
        onPress={onItemPress('PhoneNumberLogin')}
        isSkeleton={isContentLoading}
        testID='createAccountDrawerItem'
      />
      <SideMenuDrawerItem
        label={content.joinEmployerPlanDrawerItemLabel}
        iconName='user-check'
        iconSize={17}
        onPress={onItemPress('PbmMemberBenefits')}
        isSkeleton={isContentLoading}
      />
      <SideMenuDrawerItem
        label={content.contactUsDrawerItemLabel}
        iconName='headphones'
        iconSize={18}
        onPress={onItemPress('Support')}
        isSkeleton={isContentLoading}
      />
      {uselangselector ? (
        <>
          <LineSeparator
            viewStyle={sideMenuDrawerItemStyles.lineSeparatorViewStyle}
          />
          <LanguageSideMenuDrawerItem
            label={content.languageDrawerItemLabel}
            languageName={languageName}
            onPress={onItemPress('SelectLanguage')}
            isSkeleton={isContentLoading}
          />
        </>
      ) : null}
    </>
  );
};
