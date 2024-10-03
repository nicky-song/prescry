// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ReactElement } from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { IPrimaryProfile } from '../../../models/member-profile/member-profile-info';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../heading/heading';
import { RxIdCard } from '../../cards/rx-id-card/rx-id-card';
import { rxIdCardSectionStyles as styles } from './rx-id-card.section.styles';
import { SectionView } from '../../primitives/section-view';
import { RxCardType } from '../../../models/rx-id-card';

export interface IRxIdCardSectionProps extends Omit<ViewProps, 'style'> {
  title: string;
  description: string;
  profile: IPrimaryProfile;
  cardType: RxCardType;
  isSkeleton?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const RxIdCardSection = ({
  title,
  description,
  profile,
  cardType,
  isSkeleton = false,
  viewStyle,
  testID = 'rxIdCardSection',
}: IRxIdCardSectionProps): ReactElement => {
  return (
    <SectionView
      testID={testID}
      style={[styles.cardSectionViewStyle, viewStyle]}
    >
      <Heading
        level={2}
        textStyle={styles.titleTextStyle}
        isSkeleton={isSkeleton}
      >
        {title}
      </Heading>
      <BaseText isSkeleton={isSkeleton} style={styles.descriptionViewStyle}>
        {description}
      </BaseText>
      <RxIdCard profile={profile} rxCardType={cardType}></RxIdCard>
    </SectionView>
  );
};
