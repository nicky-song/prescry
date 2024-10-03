// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CloseButton } from '../../buttons/close-button/close-button';
import { GoBackButton } from '../../buttons/go-back-button/go-back.button';
import { ApplicationHeaderLogo } from '../application-header-logo/application-header-logo';
import { applicationHeaderContent } from './application-header.content';
import { applicationHeaderStyles } from './application-header.styles';
import { BaseText } from '../../text/base-text/base-text';
import { setDrawerOpenDispatch } from '../../../experiences/guest-experience/state/drawer/dispatch/set-drawer-open.dispatch';
import { RootStackNavigationProp } from '../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { useDrawerContext } from '../../../experiences/guest-experience/context-providers/drawer/drawer.context.hook';
import { useSessionContext } from '../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { PopupModal } from '../../modal/popup-modal/popup-modal';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../../experiences/guest-experience/store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { useFeaturesContext } from '../../../experiences/guest-experience/context-providers/features/use-features-context.hook';
import { IPopUpModalContent } from '../../../models/cms-content/pop-up-modal-content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { DrawerHamburgerAuthButton } from '../../buttons/drawer-hamburger-auth/drawer-hamburger-auth.button';

export enum LogoClickActionEnum {
  NONE = 'none',
  CONFIRM = 'confirm',
  NO_CONFIRM = 'noConfirm',
}

export declare type LogoClickAction =
  | LogoClickActionEnum.NONE
  | LogoClickActionEnum.CONFIRM
  | LogoClickActionEnum.NO_CONFIRM;

export interface IApplicationHeaderProps {
  title?: string;
  navigateBack?: () => void;
  navigateOnClose?: () => void;
  hideNavigationMenuButton?: boolean;
  isCardStyle?: boolean;
  showProfileAvatar?: boolean;
  showCloseButton?: boolean;
  memberProfileName?: string;
  logoClickAction?: LogoClickAction;
  testID?: string;
}

export const ApplicationHeader = (
  props: IApplicationHeaderProps
): React.ReactElement => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();
  const { getState: reduxGetState } = useReduxContext();

  const { drawerDispatch } = useDrawerContext();
  const {
    sessionState: { isUnauthExperience },
  } = useSessionContext();
  const {
    featuresState: { usehome },
  } = useFeaturesContext();

  const groupKey = CmsGroupKey.popUpModal;
  const { content } = useContent<IPopUpModalContent>(groupKey, 2);

  const handleLogoClick = () => {
    setShowModal(true);
  };

  const displayLogo = () => {
    return !isUnauthExperience &&
      props.logoClickAction === LogoClickActionEnum.CONFIRM &&
      usehome ? (
      <TouchableOpacity onPress={handleLogoClick} accessibilityRole='link'>
        <ApplicationHeaderLogo />
      </TouchableOpacity>
    ) : (
      <ApplicationHeaderLogo />
    );
  };

  const applicationHeaderTitle = props.title ? (
    <View style={applicationHeaderStyles.titleViewStyle}>
      <BaseText numberOfLines={1}>{props.title}</BaseText>
    </View>
  ) : (
    displayLogo()
  );

  const renderNavigation = () => {
    if (props.navigateBack) {
      return (
        <GoBackButton
          onPress={props.navigateBack}
          style={applicationHeaderStyles.iconViewStyle}
          accessibilityLabel={applicationHeaderContent.goBackButtonLabel}
        />
      );
    }

    return undefined;
  };

  const renderResetOrProfileAvatarIcon = () => {
    if (props.showCloseButton) {
      return (
        <CloseButton
          imageName='closeWhiteButton'
          onPress={props.navigateOnClose}
        />
      );
    }

    const openDrawer = () => {
      navigation.openDrawer();
      setDrawerOpenDispatch(drawerDispatch);
    };

    if (props.showProfileAvatar) {
      return (
        <DrawerHamburgerAuthButton
          onPress={openDrawer}
          memberProfileName={props.memberProfileName}
          testID={props.testID}
        />
      );
    }
    return;
  };

  const { navigateBack } = props;
  let navigationButton: React.ReactNode;
  let navigationMenuButton: React.ReactNode;

  if (!props.hideNavigationMenuButton) {
    navigationMenuButton = renderResetOrProfileAvatarIcon();
  }

  const hamburgerViewStyle = navigationMenuButton
    ? applicationHeaderStyles.hamburgerReseterViewStyle
    : [applicationHeaderStyles.hamburgerReseterViewStyle, { marginLeft: 0 }];

  if (navigateBack) {
    navigationButton = renderNavigation();
  }

  const cardViewStyle = props.isCardStyle ? (
    <View style={applicationHeaderStyles.cardAppearanceWrapperViewStyle}>
      <View style={applicationHeaderStyles.cardAppearanceBorderViewStyle} />
    </View>
  ) : undefined;

  const stayOnCurrentScreen = () => {
    setShowModal(false);
  };

  const handleHomeScreenNoApiRefreshDispatch = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };

  const headerViewStyle =
    applicationHeaderStyles.headerMyPrescryptineBrandingViewStyle;

  return (
    <>
      <View style={headerViewStyle}>
        <View style={applicationHeaderStyles.navigateBackViewStyle}>
          {navigationButton}
        </View>
        <View style={applicationHeaderStyles.headerLogoViewStyle}>
          {applicationHeaderTitle}
        </View>
        <View style={hamburgerViewStyle}>{navigationMenuButton}</View>
      </View>
      {cardViewStyle}
      <PopupModal
        isOpen={showModal}
        titleText={content.leavingTitle}
        content={content.leavingDesc}
        primaryButtonLabel={content.leavingPrimaryButton}
        secondaryButtonLabel={content.leavingSecondButton}
        onPrimaryButtonPress={handleHomeScreenNoApiRefreshDispatch}
        onSecondaryButtonPress={stayOnCurrentScreen}
      />
    </>
  );
};
