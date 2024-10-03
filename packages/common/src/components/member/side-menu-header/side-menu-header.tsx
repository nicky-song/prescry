// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { ProfileAvatar } from '../../../components/buttons/profile-avatar/profile-avatar';
import { ImageAsset } from '../../../components/image-asset/image-asset';
import { IconButton } from '../../buttons/icon/icon.button';
import { sideMenuHeaderStyles as styles } from './side-menu-header.styles';
import { BaseButton } from '../../buttons/base/base.button';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ISideMenuContent } from '../../../experiences/guest-experience/navigation/drawer-navigators/side-menu/side-menu.content';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

export interface ISideMenuHeaderProps {
  isUserAuthenticated?: boolean;
  memberProfileName?: string;
  onSignInPress?: () => void;
  onCloseSideMenu: () => void;
}

export const SideMenuHeader = ({
  onSignInPress,
  onCloseSideMenu,
  isUserAuthenticated,
  memberProfileName,
}: ISideMenuHeaderProps) => {
  const sideMenuGroupKey = CmsGroupKey.sideMenu;
  const {
    content: sideMenuContent,
    isContentLoading: isSideMenuContentLoading,
  } = useContent<ISideMenuContent>(sideMenuGroupKey, 2);

  const renderMemberIdInfo = () => {
    if (!isUserAuthenticated) {
      return (
        <BaseButton
          onPress={onSignInPress}
          size='medium'
          testID='sideMenuHeaderSignInButton'
          isSkeleton={isSideMenuContentLoading}
          skeletonWidth='short'
        >
          {sideMenuContent.signInButton}
        </BaseButton>
      );
    }

    if (!memberProfileName) {
      return null;
    }

    return (
      <View style={styles.memberRxContainerView} testID='memberProfileName'>
        <ProtectedBaseText>{memberProfileName}</ProtectedBaseText>
      </View>
    );
  };

  const renderProfileAvatar = () => {
    if (isUserAuthenticated && memberProfileName) {
      return <ProfileAvatar profileName={memberProfileName} />;
    }

    if (!isUserAuthenticated) {
      return null;
    }

    return (
      <View style={styles.sideMenuAvatarView} testID='userProfile'>
        <ImageAsset
          name='sideMenuAvatarIcon'
          style={styles.sideMenuAvatarImageStyle}
        />
      </View>
    );
  };

  return (
    <View style={styles.sideMenuHeaderContainerView}>
      <View style={styles.sideMenuAvatarContainerView} testID='profileHeader'>
        {renderProfileAvatar()}
        {renderMemberIdInfo()}
      </View>
      <IconButton
        testID='btnClose'
        iconName='times'
        iconTextStyle={styles.iconTextStyle}
        accessibilityLabel={sideMenuContent.closeButtonAccessibilityLabel}
        onPress={onCloseSideMenu}
        isSkeleton={isSideMenuContentLoading}
        skeletonWidth='short'
      />
    </View>
  );
};
