// Copyright 2022 Prescryptive Health, Inc.

import { IPbmMemberBenefitsScreenStyles } from './pbm-member-benefits.screen.styles';
import { ISignUpContent } from '../../../../../models/cms-content/sign-up.ui-content';
import React, { ReactElement } from 'react';
import { BenefitsList } from '../../../../../components/member/lists/benefits/benefits.list';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { Heading } from '../../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import { View } from 'react-native';

export interface PbmMemberBenefitsListProps {
  styles: IPbmMemberBenefitsScreenStyles;
  content: ISignUpContent;
  showSkeleton: boolean;
}

export const PbmMemberBenefitsList = (
  props: PbmMemberBenefitsListProps
): ReactElement => {
  const { styles, content, showSkeleton } = props;
  return (
    <View>
      <Heading textStyle={styles.titleTextStyle} isSkeleton={showSkeleton}>
        {content.pbmSignUpHeader}
      </Heading>
      <BaseText style={styles.instructionsTextStyle} isSkeleton={showSkeleton}>
        {content.pbmSignUpDescription}
      </BaseText>
      <LineSeparator viewStyle={styles.separatorViewStyle} />
      <BenefitsList />
    </View>
  );
};
