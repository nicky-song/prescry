// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Heading } from '../../../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../../../components/member/line-separator/line-separator';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { IOrderConfirmationScreenContent } from '../../order-confirmation.screen.content';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { whatIsNextSectionStyle } from './what-is-next.section.styles';

export interface IWhatIsNextSection {
  customContent?: string;
  viewStyle?: StyleProp<ViewStyle>;
}

export const WhatIsNextSection = (props: IWhatIsNextSection): ReactElement => {
  const groupKey = CmsGroupKey.orderConfirmation;

  const { content, isContentLoading } =
    useContent<IOrderConfirmationScreenContent>(groupKey, 2);
  const styles = whatIsNextSectionStyle;

  return (
    <SectionView
      testID='whatIsNextSection'
      style={props.viewStyle}
    >
      <Heading
        level={2}
        textStyle={styles.heading2TextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.whatIsNextHeader}
      </Heading>
      <BaseText isSkeleton={isContentLoading} skeletonWidth='medium'>
        {props.customContent ?? content.whatIsNextInstructions}
      </BaseText>
      <LineSeparator viewStyle={styles.separatorViewStyle} />
    </SectionView>
  );
};
