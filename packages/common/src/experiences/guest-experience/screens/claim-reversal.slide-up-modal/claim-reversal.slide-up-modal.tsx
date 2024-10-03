// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  ISlideUpModalProps,
  SlideUpModal,
} from '../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { Heading } from '../../../../components/member/heading/heading';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { claimReversalSlideUpModalStyles } from './claim-reversal.slide-up-modal.styles';
import { IClaimReversalSlideUpModalContent } from './claim-reversal.slide-up-modal.content';

export type IClaimReversalSlideUpModalProps = Pick<
  ISlideUpModalProps,
  'isVisible' | 'onClosePress' | 'viewStyle'
>;

export const ClaimReversalSlideUpModal = ({
  isVisible,
  onClosePress,
  viewStyle,
}: IClaimReversalSlideUpModalProps): ReactElement => {
  const { content, isContentLoading } =
    useContent<IClaimReversalSlideUpModalContent>(
      CmsGroupKey.claimReversalSlideUpModal,
      2
    );

  const children = (
    <>
      <Heading
        level={3}
        textStyle={claimReversalSlideUpModalStyles.headingOneTextStyle}
        isSkeleton={isContentLoading}
      >
        {content.headingOne}
      </Heading>
      <BaseText
        style={claimReversalSlideUpModalStyles.descriptionOneTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.descriptionOne}
      </BaseText>
      <Heading
        level={3}
        textStyle={claimReversalSlideUpModalStyles.headingTwoTextStyle}
        isSkeleton={isContentLoading}
      >
        {content.headingTwo}
      </Heading>
      <BaseText
        style={claimReversalSlideUpModalStyles.descriptionTwoTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.descriptionTwo}
      </BaseText>
      <Heading
        level={3}
        textStyle={claimReversalSlideUpModalStyles.headingThreeTextStyle}
        isSkeleton={isContentLoading}
      >
        {content.headingThree}
      </Heading>
      <BaseText
        style={claimReversalSlideUpModalStyles.descriptionThreeTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.descriptionThree}
      </BaseText>
    </>
  );
  return (
    <SlideUpModal
      key='claim-reversal-slide-up-modal'
      isVisible={isVisible}
      onClosePress={onClosePress}
      heading={content.heading}
      isSkeleton={isContentLoading}
      viewStyle={viewStyle}
      testID='claimReversalSlideUpModal'
    >
      {children}
    </SlideUpModal>
  );
};
