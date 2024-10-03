// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ViewStyle, View, StyleProp } from 'react-native';
import { Heading } from '../../../../../../components/member/heading/heading';
import { InlineLink } from '../../../../../../components/member/links/inline/inline.link';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { ISmartPriceSectionContent } from './smart-price.section.content';
import { smartPriceSectionStyles } from './smart-price.section.styles';

export interface ISmartPriceSectionProps {
  onLearnMorePress: () => void;
  viewStyle?: StyleProp<ViewStyle>;
}

export const SmartPriceSection = (
  smartPriceSectionProps: ISmartPriceSectionProps
): ReactElement => {
  const { viewStyle, onLearnMorePress } = smartPriceSectionProps;

  const { content, isContentLoading } = useContent<ISmartPriceSectionContent>(
    CmsGroupKey.smartPriceSection,
    2
  );

  return (
    <View style={viewStyle}>
      <Heading level={2} isSkeleton={isContentLoading} translateContent={false}>
        {content.heading}
      </Heading>
      <BaseText style={smartPriceSectionStyles.containerTextStyle}>
        <BaseText>{content.description + ' '}</BaseText>
        <InlineLink onPress={onLearnMorePress}>{content.learnMore}</InlineLink>
      </BaseText>
    </View>
  );
};
