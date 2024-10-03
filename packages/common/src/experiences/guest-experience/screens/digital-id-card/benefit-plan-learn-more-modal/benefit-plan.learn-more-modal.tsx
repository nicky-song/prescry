// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Heading } from '../../../../../components/member/heading/heading';
import { SlideUpModal } from '../../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { IBenefitPlanLearnMoreModalContent } from './benefit-plan.learn-more-modal.content';
import { benefitPlanLearnMoreModalStyles } from './benefit-plan.learn-more-modal.styles';

export interface IBenefitPlanLearnMoreModalProps {
  onClosePress: () => void;
  showModal: boolean;
  viewStyle?: StyleProp<ViewStyle>;
}

export const BenefitPlanLearnMoreModal = ({
  onClosePress,
  showModal,
  viewStyle,
}: IBenefitPlanLearnMoreModalProps): ReactElement => {
  const { content, isContentLoading } =
    useContent<IBenefitPlanLearnMoreModalContent>(
      CmsGroupKey.benefitPlanLearnMoreModal,
      2
    );

  const modalBody = (
    <View>
      <Heading isSkeleton={isContentLoading} level={3}>
        {content.headingOne}
      </Heading>
      <BaseText
        isSkeleton={isContentLoading}
        style={benefitPlanLearnMoreModalStyles.descriptionTextStyle}
      >
        {content.descriptionOne}
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
