// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { IconButton } from '../../buttons/icon/icon.button';
import { Heading } from '../../member/heading/heading';
import { slideUpModalStyles } from './slide-up.modal.styles';

export interface ISlideUpModalProps {
  children: ReactNode;
  isVisible?: boolean;
  heading: string;
  viewStyle?: StyleProp<ViewStyle>;
  onClosePress: () => void;
  isSkeleton?: boolean;
  testID?: string;
}

export const SlideUpModal = ({
  children,
  isVisible = false,
  heading,
  viewStyle,
  onClosePress,
  isSkeleton,
  testID = 'slideUpModal',
}: ISlideUpModalProps): ReactElement => {
  const styles = slideUpModalStyles;

  const { content } = useContent<IGlobalContent>(CmsGroupKey.global, 2);

  return (
    <Modal
      style={[styles.modalViewStyle, viewStyle]}
      isVisible={isVisible}
      backdropOpacity={0.5}
      testID={testID}
    >
      <ScrollView
        style={styles.contentViewStyle}
        testID='slideUpModalContentContainer'
      >
        <View>
          <View
            style={styles.headingViewStyle}
            testID='slideUpModalHeadingContainer'
          >
            <Heading level={2} isSkeleton={isSkeleton}>
              {heading}
            </Heading>
            <IconButton
              iconName='times'
              iconTextStyle={styles.iconTextStyle}
              accessibilityLabel={content.closeDialog}
              onPress={onClosePress}
              testID='modalCloseButton'
            />
          </View>
          {children}
        </View>
      </ScrollView>
    </Modal>
  );
};
