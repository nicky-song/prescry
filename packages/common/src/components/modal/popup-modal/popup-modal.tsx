// Copyright 2018 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { View, ViewStyle, StyleProp, Animated } from 'react-native';
import { animateOpacity } from '../../../utils/animation.helper';
import { BaseButton, ButtonSize } from '../../buttons/base/base.button';
import { SecondaryButton } from '../../buttons/secondary/secondary.button';
import { Heading } from '../../member/heading/heading';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { RecoveryEmailSuccessModal } from '../recover-email-success-modal/recovery-email-success-modal';
import { RecoveryEmailModalConnected } from '../recovery-email-modal/recovery-email-modal.connected';
import { popupModalContent } from './popup-modal.content';
import { popupModalstyles as styles } from './popup-modal.styles';

export interface IPopupModalProps {
  isOpen?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  toggleModal?: () => void;
  modalType?: string;
  titleText?: string;
  content?: React.ReactNode;
  onPrimaryButtonPress?: (value?: string) => void;
  primaryButtonLabel?: string;
  onSecondaryButtonPress?: () => void;
  secondaryButtonLabel?: string;
  buttonSize?: ButtonSize;
  primaryButtonTestID?: string;
  secondaryButtonTestID?: string;
}

export const PopupModal = (props: IPopupModalProps) => {
  const {
    modalType,
    titleText,
    content,
    viewStyle,
    isOpen,
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    primaryButtonLabel,
    secondaryButtonLabel,
    buttonSize,
  } = props;

  const [opacity] = useState(new Animated.Value(0));
  const [height, heightSet] = useState('0%');
  const [zIndex, zIndexSet] = useState(-1);
  const [currentModalType, setCurrentModalType] = useState(modalType);

  useEffect(() => {
    if (isOpen) {
      animateOpacity(opacity, 300, 1);
      heightSet('100vh');
      zIndexSet(100);
    } else {
      animateOpacity(opacity, 0, 0);
      heightSet('0vh');
      zIndexSet(-1);
    }
  }, [isOpen]);

  const onChangeModalType = (type: string) => {
    setCurrentModalType(type);
  };

  const mediumButtonViewStyle =
    buttonSize === 'medium' ? styles.mediumButtonViewStyle : undefined;

  const primaryButton = onPrimaryButtonPress ? (
    <BaseButton
      onPress={onPrimaryButtonPress}
      size={buttonSize}
      viewStyle={mediumButtonViewStyle}
      testID={props.primaryButtonTestID}
    >
      {primaryButtonLabel ?? popupModalContent.defaultCloseText}
    </BaseButton>
  ) : null;

  const secondaryButton = onSecondaryButtonPress ? (
    <SecondaryButton
      onPress={onSecondaryButtonPress}
      size={buttonSize}
      viewStyle={[styles.secondaryButtonViewStyle, mediumButtonViewStyle]}
      testID={props.secondaryButtonTestID}
    >
      {secondaryButtonLabel}
    </SecondaryButton>
  ) : null;

  const title = titleText ? (
    <Heading level={3} textStyle={styles.titleTextStyle}>
      {titleText}
    </Heading>
  ) : null;

  const defaultBody = content ? (
    <View testID='defaultPopupModal'>
      {title}
      <View style={styles.contentContainerViewStyle}>
        <MarkdownText>{content}</MarkdownText>
      </View>
      {primaryButton}
      {secondaryButton}
    </View>
  ) : null;

  const renderBody = (type?: string) => {
    switch (type) {
      case 'recoveryEmailModal':
        return (
          <RecoveryEmailModalConnected
            onChangeModalType={onChangeModalType}
            {...props}
          />
        );
      case 'recoveryEmailSuccessModal':
        return <RecoveryEmailSuccessModal {...props} />;
    }
    return defaultBody;
  };

  return (
    <Animated.View
      style={[styles.modalContainerViewStyle, { opacity, height, zIndex }]}
    >
      <View style={[styles.modalInnerContainerViewStyle, viewStyle]}>
        {renderBody(currentModalType)}
      </View>
    </Animated.View>
  );
};
