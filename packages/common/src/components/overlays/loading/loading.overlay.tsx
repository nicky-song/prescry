// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { loadingOverlayStyles } from './loading.overlay.styles';
import { loadingOverlayContent } from './loading.overlay.content';
import { BaseText } from '../../text/base-text/base-text';

export interface ILoadingOverlayProps {
  showMessage?: boolean;
  message?: string;
  visible?: boolean;
}

export const LoadingOverlay = ({
  showMessage,
  message,
  visible,
}: ILoadingOverlayProps): ReactElement => {
  const loadingMessage = message ?? loadingOverlayContent.defaultMessage;

  const loadingMessageContent =
    visible && showMessage ? (
      <View
        style={loadingOverlayStyles.messageContainerViewStyle}
        testID='overlay-content-message'
      >
        <BaseText style={loadingOverlayStyles.messageTextStyle}>
          {loadingMessage}
        </BaseText>
        <BaseText style={loadingOverlayStyles.doNotRefreshTextStyle}>
          {loadingOverlayContent.doNotRefreshMessage}
        </BaseText>
      </View>
    ) : null;

  return (
    <Modal transparent={true} visible={visible}>
      <View
        style={loadingOverlayStyles.contentViewStyle}
        testID='overlay-content'
      >
        {loadingMessageContent}
        <ActivityIndicator
          color={loadingOverlayStyles.spinnerColorTextStyle.color}
          size='large'
        />
      </View>
    </Modal>
  );
};
