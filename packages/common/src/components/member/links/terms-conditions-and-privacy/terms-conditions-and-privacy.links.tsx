// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ISideMenuContent } from '../../../../experiences/guest-experience/navigation/drawer-navigators/side-menu/side-menu.content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import {
  goToTermsAndConditionsUrl,
  goToPrivacyPolicyUrl,
} from '../../../../utils/navigation-helpers/url-helper-functions';
import { BaseText } from '../../../text/base-text/base-text';
import { InlineLink } from '../inline/inline.link';
import { termsConditionsAndPrivacyLinksStyles } from './terms-conditions-and-privacy.links.styles';

export interface ITermsConditionsAndPrivacyLinksProps {
  viewStyle?: StyleProp<ViewStyle>;
  isMultiLine?: boolean;
}

export const TermsConditionsAndPrivacyLinks = ({
  viewStyle,
  isMultiLine,
}: ITermsConditionsAndPrivacyLinksProps): ReactElement => {
  const sideMenuGroupKey = CmsGroupKey.sideMenu;
  const {
    content: sideMenuContent,
    isContentLoading: isSideMenuContentLoading,
  } = useContent<ISideMenuContent>(sideMenuGroupKey, 2);

  const firstLinkTextStyle = isMultiLine
    ? [
      termsConditionsAndPrivacyLinksStyles.textStyle,
      termsConditionsAndPrivacyLinksStyles.multiLineTextStyle,
    ]
    : termsConditionsAndPrivacyLinksStyles.textStyle;

  return (
    <View style={[termsConditionsAndPrivacyLinksStyles.viewStyle, viewStyle]}>
      <InlineLink
        onPress={goToTermsAndConditionsUrl}
        testID='onTermsAndCondition'
        textStyle={firstLinkTextStyle}
        isSkeleton={isSideMenuContentLoading}
      >
        {sideMenuContent.termsAndConditions}
      </InlineLink>
      { 
        isMultiLine ? null : (
          <BaseText style={termsConditionsAndPrivacyLinksStyles.dividerTextStyle}>
            |
          </BaseText>
        )
      }
      <InlineLink
        onPress={goToPrivacyPolicyUrl}
        testID='onPrivacyPolicy'
        textStyle={termsConditionsAndPrivacyLinksStyles.textStyle}
        isSkeleton={isSideMenuContentLoading}
      >
        {sideMenuContent.privacyPolicy}
      </InlineLink>
    </View>
  );
};
