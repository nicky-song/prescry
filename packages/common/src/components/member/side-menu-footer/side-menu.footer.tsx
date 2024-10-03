// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ISideMenuContent } from '../../../experiences/guest-experience/navigation/drawer-navigators/side-menu/side-menu.content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { TermsConditionsAndPrivacyLinks } from '../links/terms-conditions-and-privacy/terms-conditions-and-privacy.links';
import { sideMenuFooterStyles as styles } from './side-menu.footer.styles';

export const SideMenuFooter = (): ReactElement => {
  const sideMenuGroupKey = CmsGroupKey.sideMenu;
  const {
    content: sideMenuContent,
    isContentLoading: isSideMenuContentLoading,
  } = useContent<ISideMenuContent>(sideMenuGroupKey, 2);

  return (
    <View style={styles.sideMenuFooterContainerViewStyle}>
      <TermsConditionsAndPrivacyLinks 
        viewStyle={styles.termsConditionsAndPrivacyLinksStyles}
        isMultiLine={true}
      />
      <ProtectedBaseText
        style={styles.copyrightTextStyle}
        isSkeleton={isSideMenuContentLoading}
        skeletonWidth='long'
      >
        {sideMenuContent.copyRightText}
      </ProtectedBaseText>
      <BaseText
        style={styles.rightsReservedTextStyle}
        isSkeleton={isSideMenuContentLoading}
        skeletonWidth='long'
      >
        {sideMenuContent.rightsReservedText}
      </BaseText>
    </View>
  );
};
