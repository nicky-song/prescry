// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { recoveryEmailSuccessModalStyles as styles } from './recovery-email-success-modal.styles';
import { recoveryEmailSuccessModalContent } from './recovery-email-success-modal.content';
import { BaseButton } from '../../buttons/base/base.button';
import { Heading } from '../../member/heading/heading';

export interface IRecoveryEmailSuccessModalProps {
  toggleModal?: () => void;
}

export const RecoveryEmailSuccessModal = (
  props: IRecoveryEmailSuccessModalProps
) => {
  const { toggleModal } = props;

  const title = (
    <View
      style={styles.titleContainerViewStyle}
      testID={`txt_RecoveryEmailSuccessModalHeader`}
    >
      <Heading level={2}>{recoveryEmailSuccessModalContent.titleText}</Heading>
    </View>
  );

  const onPrimaryButtonPressHandler = () => {
    if (toggleModal) {
      toggleModal();
    }
  };

  const primaryButton = (
    <BaseButton
      onPress={onPrimaryButtonPressHandler}
      testID='recoveryEmailSuccessModalCloseButton'
    >
      {recoveryEmailSuccessModalContent.buttonText}
    </BaseButton>
  );

  return (
    <>
      {title}
      <View style={styles.contentContainerViewStyle}>
        <MarkdownText>{recoveryEmailSuccessModalContent.mainText}</MarkdownText>
      </View>
      {primaryButton}
    </>
  );
};
