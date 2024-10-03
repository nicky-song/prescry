// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Heading } from '../../../../../components/member/heading/heading';
import { SlideUpModal } from '../../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { ISmartPriceLearnMoreModalContent } from './smart-price.learn-more-modal.content';
import { smartPriceLearnMoreModalStyles } from './smart-price.learn-more-modal.styles';

export interface ISmartPriceLearnMoreModalProps {
  onClosePress: () => void;
  showModal: boolean;
  viewStyle?: StyleProp<ViewStyle>;
}
export const SmartPriceLearnMoreModal = ({
  onClosePress,
  showModal,
  viewStyle,
}: ISmartPriceLearnMoreModalProps): ReactElement => {
  const { content, isContentLoading } =
    useContent<ISmartPriceLearnMoreModalContent>(
      CmsGroupKey.smartPriceLearnMoreModal,
      2
    );

  const modalBody = (
    <View>
      <BaseText style={smartPriceLearnMoreModalStyles.headingOneTextStyle}>
        <Heading isSkeleton={isContentLoading} level={3}>
          {content.headingOneA + ' '}
        </Heading>
        <Heading
          isSkeleton={isContentLoading}
          translateContent={false}
          level={3}
        >
          {content.headingOneB}
        </Heading>
      </BaseText>
      <BaseText
        isSkeleton={isContentLoading}
        style={smartPriceLearnMoreModalStyles.descriptionOneTextStyle}
      >
        {content.descriptionOne}
      </BaseText>
      <BaseText style={smartPriceLearnMoreModalStyles.headingTwoTextStyle}>
        <Heading isSkeleton={isContentLoading} level={3}>
          {content.headingTwoA + ' '}
        </Heading>
        <Heading
          isSkeleton={isContentLoading}
          translateContent={false}
          level={3}
        >
          {content.headingTwoB + ' '}
        </Heading>
        <Heading isSkeleton={isContentLoading} level={3}>
          {content.headingTwoC}
        </Heading>
      </BaseText>
      <BaseText
        isSkeleton={isContentLoading}
        style={smartPriceLearnMoreModalStyles.descriptionTwoTextStyle}
      >
        {content.descriptionTwo}
      </BaseText>
    </View>
  );
  return (
    <SlideUpModal
      isVisible={showModal}
      heading={content.heading}
      onClosePress={onClosePress}
      isSkeleton={isContentLoading}
      viewStyle={viewStyle}
    >
      {modalBody}
    </SlideUpModal>
  );
};
