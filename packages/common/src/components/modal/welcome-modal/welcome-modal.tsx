// Copyright 2022 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import { removeSearchParamsFromUrl } from '../../../utils/remove-search-params-from-url.helper';
import { useCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { BaseButton } from '../../buttons/base/base.button';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { welcomeModalStyles } from './welcome-modal.styles';
import { ImageAsset } from '../../image-asset/image-asset';
import { RemoteImageAsset } from '../../remote-image-asset/remote-image-asset';

export interface IWelcomeModalProps {
  rxGroup?: string;
  brokerId?: string;
}

export const WelcomeModal = (props: IWelcomeModalProps) => {
  const rxGroupCobrandingUIContent = useCobrandingContent(props.rxGroup);
  const brokerIdCobrandingUIContent = useCobrandingContent(props.brokerId);
  const globalGroupKey = CmsGroupKey.global;
  const globalUIContent = useContent<IGlobalContent>(globalGroupKey, 2);
  const cobrandingContent =
    rxGroupCobrandingUIContent.interstitialContent ||
    brokerIdCobrandingUIContent.interstitialContent;

  const [isModalVisible, setIsModalVisible] = useState(!!cobrandingContent);
  const styles = welcomeModalStyles;

  useEffect(() => {
    if (!!cobrandingContent !== isModalVisible) {
      setIsModalVisible(!!cobrandingContent);
    }
  }, [cobrandingContent]);

  const onButtonPressHandler = () => {
    setIsModalVisible(false);
    removeSearchParamsFromUrl(['rxgroup', 'brokerid']);
  };

  const cobrandingLogo = rxGroupCobrandingUIContent.interstitialContent
    ? rxGroupCobrandingUIContent.logo
    : brokerIdCobrandingUIContent.interstitialContent
    ? brokerIdCobrandingUIContent.logo
    : undefined;

  const displayCobrandingLogo = cobrandingLogo ? (
    <RemoteImageAsset uri={cobrandingLogo} />
  ) : null;

  const brandingInstanceName = 'headerMyPrescryptiveLogo';
  const brandingInstanceStyling = styles.brandMyPrescryptiveImageStyle;

  return (
    <Modal transparent visible={isModalVisible}>
      <View
        style={styles.outerContainerViewStyle}
        testID='welcomeModalBackgroundView'
      >
        <View style={styles.modalViewStyle} testID='welcomeModalView'>
          <View
            style={styles.logoHolderViewStyle}
            testID='welcomeModalLogoHolder'
          >
            <ImageAsset
              name={brandingInstanceName}
              style={brandingInstanceStyling}
              resizeMode='contain'
            />
            {displayCobrandingLogo}
          </View>
          <MarkdownText textStyle={styles.contentContainerTextStyle}>
            {cobrandingContent}
          </MarkdownText>
          <BaseButton
            onPress={onButtonPressHandler}
            isSkeleton={globalUIContent.isContentLoading}
          >
            {globalUIContent.content.okButton}
          </BaseButton>
        </View>
      </View>
    </Modal>
  );
};
