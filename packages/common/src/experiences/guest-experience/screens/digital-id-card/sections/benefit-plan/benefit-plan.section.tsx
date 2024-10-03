// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ViewStyle, View, StyleProp } from 'react-native';
import { Heading } from '../../../../../../components/member/heading/heading';
import { InlineLink } from '../../../../../../components/member/links/inline/inline.link';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { IBenefitPlanSectionContent } from './benefit-plan.section.content';
import { benefitPlanSectionStyles } from './benefit-plan.section.styles';

export interface IBenefitPlanSectionProps {
  onLearnMorePress?: () => void;
  viewStyle?: StyleProp<ViewStyle>;
}

export const BenefitPlanSection = (
  BenefitPlanSectionProps: IBenefitPlanSectionProps
): ReactElement => {
  const { onLearnMorePress, viewStyle } = BenefitPlanSectionProps;

  const { content, isContentLoading } = useContent<IBenefitPlanSectionContent>(
    CmsGroupKey.benefitPlanSection,
    2
  );

  const description = content.description + ' ';

  const inlineLink = onLearnMorePress ? (
    <InlineLink onPress={onLearnMorePress} isSkeleton={isContentLoading}>
      {content.learnMore}
    </InlineLink>
  ) : null;

  return (
    <View style={viewStyle}>
      <Heading level={2} isSkeleton={isContentLoading} translateContent={false}>
        {content.heading}
      </Heading>
      <BaseText style={benefitPlanSectionStyles.descriptionTextStyle}>
        <BaseText isSkeleton={isContentLoading}>{description}</BaseText>
        {inlineLink}
      </BaseText>
    </View>
  );
};
