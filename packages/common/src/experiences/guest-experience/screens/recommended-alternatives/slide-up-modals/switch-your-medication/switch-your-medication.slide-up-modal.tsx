// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { Heading } from '../../../../../../components/member/heading/heading';
import {
  ISlideUpModalProps,
  SlideUpModal,
} from '../../../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { useSwitchYourMedicationSlideUpModalCobrandingContentHelper } from './switch-your-medication.slide-up-modal.cobranding-content-helper';
import { switchYourMedicationSlideUpModalStyles } from './switch-your-medication.slide-up-modal.styles';

export const SwitchYourMedicationSlideUpModal = ({
  isVisible,
  onClosePress,
  viewStyle,
}: Pick<
  ISlideUpModalProps,
  'isVisible' | 'onClosePress' | 'viewStyle'
>): ReactElement => {
  const { content, isContentLoading, isCobranding } =
    useSwitchYourMedicationSlideUpModalCobrandingContentHelper();

  const cobrandingChildren = (
    <BaseText
      isSkeleton={isContentLoading}
      style={switchYourMedicationSlideUpModalStyles.descriptionTextStyle}
      skeletonWidth='long'
    >
      {content.description}
    </BaseText>
  );

  const defaultChildren = (
    <View>
      <BaseText
        isSkeleton={isContentLoading}
        style={switchYourMedicationSlideUpModalStyles.descriptionTextStyle}
        skeletonWidth='long'
      >
        {content.description}
      </BaseText>
      <Heading
        isSkeleton={isContentLoading}
        level={3}
        skeletonWidth='medium'
        textStyle={
          switchYourMedicationSlideUpModalStyles.genericsHeadingTextStyle
        }
      >
        {content.genericsHeading}
      </Heading>
      <BaseText
        isSkeleton={isContentLoading}
        skeletonWidth='long'
        style={
          switchYourMedicationSlideUpModalStyles.genericsDescriptionTextStyle
        }
      >
        {content.genericsDescription}
      </BaseText>
      <Heading
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
        level={3}
        textStyle={
          switchYourMedicationSlideUpModalStyles.therapeuticAlternativesHeadingTextStyle
        }
      >
        {content.therapeuticAlternativesHeading}
      </Heading>
      <BaseText
        isSkeleton={isContentLoading}
        skeletonWidth='long'
        style={
          switchYourMedicationSlideUpModalStyles.therapeuticAlternativesDescriptionTextStyle
        }
      >
        {content.therapeuticAlternativesDescription}
      </BaseText>
      <Heading
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
        level={3}
        textStyle={
          switchYourMedicationSlideUpModalStyles.discretionaryAlternativesHeadingTextStyle
        }
      >
        {content.discretionaryAlternativesHeading}
      </Heading>
      <BaseText isSkeleton={isContentLoading} skeletonWidth='long'>
        {content.discretionaryAlternativesDescription}
      </BaseText>
    </View>
  );

  const children = isCobranding ? cobrandingChildren : defaultChildren;

  return (
    <SlideUpModal
      key='switch-your-medication-slide-up-modal'
      isVisible={isVisible}
      onClosePress={onClosePress}
      children={children}
      heading={content.heading}
      isSkeleton={isContentLoading}
      viewStyle={viewStyle}
      testID='switchYourMedicationSlideUpModal'
    />
  );
};
