// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { getFooterStyles } from './footer.styles';
import { FooterView } from '../../../../../../components/primitives/footer-view';
import { ImageAsset } from '../../../../../../components/image-asset/image-asset';
import { LanguagePicker } from '../../../../../../components/member/pickers/language/language.picker';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { useFooterContent } from './use-footer.content';
import { isDesktopDevice } from '../../../../../../utils/responsive-screen.helper';
import { goToUrl } from '../../../../../../utils/link.helper';
import { useFlags } from 'launchdarkly-react-client-sdk';

export const Footer = (): ReactElement => {
  const { privacyPolicyLabel, termsAndConditionsLabel } = useFooterContent();

  const isDesktop = isDesktopDevice();

  const styles = getFooterStyles(isDesktop);

  const { uselangselector } = useFlags();

  const onTermsPressed = async () => {
    await goToUrl('https://prescryptive.com/terms-of-use/');
  };

  const onPrivacyPressed = async () => {
    await goToUrl('https://prescryptive.com/privacy-policy/');
  };

  return (
    <FooterView testID='Footer' style={styles.footerViewStyle}>
      <View
        style={styles.prescryptiveLogoContainerViewStyle}
        testID='prescryptiveLogo'
      >
        <ImageAsset
          name='prescryptiveLogo'
          style={styles.prescryptiveLogoImageStyle}
        />
      </View>
      <View
        style={styles.languagePickerAndLinksContainerViewStyle}
        testID='languagePickerAndLinks'
      >
        {!uselangselector ? (
          <View
            testID='languagePicker'
            style={styles.languagePickerContainerViewStyle}
          >
            <LanguagePicker textStyle={styles.languagePickerTextStyle} />
          </View>
        ) : null}
        <BaseText style={styles.linkTextStyle} onPress={onPrivacyPressed}>
          {privacyPolicyLabel}
        </BaseText>
        <BaseText
          style={[styles.linkTextStyle, styles.termsAndConditionsLinkTextStyle]}
          onPress={onTermsPressed}
        >
          {termsAndConditionsLabel}
        </BaseText>
      </View>
    </FooterView>
  );
};
