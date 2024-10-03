// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { LinkCheckbox } from '../link/link.checkbox';
import {
  goToPrivacyPolicyUrl,
  goToTermsAndConditionsUrl,
} from '../../../../utils/navigation-helpers/url-helper-functions';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignInContent } from '../../../../models/cms-content/sign-in.ui-content';

export interface ITermsConditionsAndPrivacyCheckboxProps {
  onPress: (checkBoxChecked: boolean, checkBoxValue: string) => void;
  viewStyle?: StyleProp<ViewStyle>;
}

export const TermsConditionsAndPrivacyCheckbox = ({
  onPress,
  viewStyle,
}: ITermsConditionsAndPrivacyCheckboxProps): ReactElement => {
  const groupKey = CmsGroupKey.signIn;
  const { content } = useContent<ISignInContent>(groupKey, 2);

  const onLinkPress = (url: string): boolean => {
    const linkHandler = async () => {
      if (url === 'terms') {
        await goToTermsAndConditionsUrl();
      } else {
        await goToPrivacyPolicyUrl();
      }
    };

    void linkHandler();
    return false;
  };

  return (
    <View style={viewStyle} testID='chktermsAndConditions'>
      <LinkCheckbox
        testID='termsAndConditionsCheck'
        checkboxValue='acceptTermAndCondition'
        markdown={content.termsAndConditionsCheckboxLabel}
        onCheckboxPress={onPress}
        onLinkPress={onLinkPress}
      />
    </View>
  );
};
