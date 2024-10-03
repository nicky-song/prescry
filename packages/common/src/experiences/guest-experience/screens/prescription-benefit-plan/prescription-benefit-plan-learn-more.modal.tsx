// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { Heading } from '../../../../components/member/heading/heading';
import { SlideUpModal } from '../../../../components/modal/slide-up/slide-up.modal';
import { List } from '../../../../components/primitives/list';
import { ListItem } from '../../../../components/primitives/list-item';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IPrescriptionBenefitPlanLearnMoreModal } from './prescription-benefit-plan-learn-more.modal.content';
import { prescriptionBenefitPlanScreenStyles } from './prescription-benefit-plan.screen.styles';

export interface IPrescriptionBenefitPlanLearnMoreModalProps {
  onPressHandler: () => void;
  showModal: boolean;
}
export const PrescriptionBenefitPlanLearnMoreModal = ({
  onPressHandler,
  showModal,
}: IPrescriptionBenefitPlanLearnMoreModalProps): ReactElement => {
  const { content: modalContent, isContentLoading: isModalContentLoading } =
    useContent<IPrescriptionBenefitPlanLearnMoreModal>(
      CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
      2
    );

  const modalBody = (
    <List testID='prescriptionBenefitPlanSlideUpModalBody'>
      <ListItem>
        <Heading level={3}>{modalContent.deductiblesTitle}</Heading>
        <BaseText
          style={prescriptionBenefitPlanScreenStyles.subTitleFirstTextViewStyle}
        >
          {modalContent.deductiblesDescription}
        </BaseText>
      </ListItem>
      <ListItem>
        <Heading level={3}>{modalContent.outOfPocketTitle}</Heading>
        <BaseText
          style={
            prescriptionBenefitPlanScreenStyles.subTitleSecondTextViewStyle
          }
        >
          {modalContent.outOfPocketDescription}
        </BaseText>
      </ListItem>
    </List>
  );
  return (
    <SlideUpModal
      isVisible={showModal}
      heading={modalContent.heading}
      onClosePress={onPressHandler}
      isSkeleton={isModalContentLoading}
    >
      {modalBody}
    </SlideUpModal>
  );
};
