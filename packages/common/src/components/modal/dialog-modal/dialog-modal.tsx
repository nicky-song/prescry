// Copyright 2021 Prescryptive Health, Inc.

import React, {
  FunctionComponent,
  useEffect,
  useState,
  ReactElement,
} from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { animateOpacity } from '../../../utils/animation.helper';
import { IconButton } from '../../buttons/icon/icon.button';
import { BaseText } from '../../text/base-text/base-text';
import { dialogModalContent } from './dialog-modal.content';

import { dialogModalStyles } from './dialog-modal.style';

export interface IDialogModalProps {
  isOpen?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
}

export const DialogModal: FunctionComponent<IDialogModalProps> = ({
  header,
  footer,
  body,
  viewStyle,
  isOpen,
  onClose,
}: IDialogModalProps): ReactElement => {
  const [opacity] = useState(new Animated.Value(0));
  const [zIndex, zIndexSet] = useState(-1);

  useEffect(() => {
    if (isOpen) {
      animateOpacity(opacity, 300, 1);
      zIndexSet(1);
    } else {
      animateOpacity(opacity, 0, 0);
      zIndexSet(-1);
    }
  }, [isOpen]);

  const closeButton = onClose ? (
    <View style={dialogModalStyles.closeBtnContainer}>
      <IconButton
        iconName='times'
        onPress={onClose}
        accessibilityLabel={dialogModalContent.closeButtonLabel}
        iconTextStyle={dialogModalStyles.iconButtonTextStyle}
      />
    </View>
  ) : null;

  const setViewResponder = () => true;

  const onViewResponderRelease = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <Animated.View
      onStartShouldSetResponder={setViewResponder}
      onResponderRelease={onViewResponderRelease}
      style={[dialogModalStyles.modalContainerViewStyle, { opacity, zIndex }]}
    >
      <View style={[dialogModalStyles.modalInnerContainerViewStyle, viewStyle]}>
        <View style={dialogModalStyles.headerContainerViewStyle}>
          <BaseText size='extraLarge' weight='semiBold'>
            {header}
          </BaseText>
          {closeButton}
        </View>
        <View
          testID='defaultPopupModal'
          style={dialogModalStyles.bodyContainerViewStyle}
        >
          {body}
        </View>
        <View style={dialogModalStyles.footerContainerViewStyle}>{footer}</View>
      </View>
    </Animated.View>
  );
};
