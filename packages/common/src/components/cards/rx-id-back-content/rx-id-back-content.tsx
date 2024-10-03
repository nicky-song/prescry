// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { rxIdBackContentStyles as styles } from './rx-id-back-content.styles';
import { StyleProp, View, ViewStyle } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { IRxIdBackContentCmsContent } from './rx-id-back-content.cms-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { LineSeparator } from '../../member/line-separator/line-separator';

export interface IRxIdBackContentProps {
  memberSince: string;
  viewStyle?: StyleProp<ViewStyle>;
}

export const RxIdBackContent = (props: IRxIdBackContentProps) => {
  const {
    content: {
      memberSince,
      myrxURL,
      membersTitle,
      membersDescription,
      claimsTitle,
      claimsDescription,
      sendPrescriptionsInstruction,
      prescryptiveAddress,
    },
    isContentLoading,
  } = useContent<IRxIdBackContentCmsContent>(CmsGroupKey.rxIdBackContent, 2);

  return (
    <View style={props.viewStyle}>
      <View style={styles.headerViewStyle}>
        <BaseText
          style={styles.memberSinceTextStyle}
          isSkeleton={isContentLoading}
        >{`${memberSince} ${props.memberSince}`}</BaseText>
        <BaseText style={styles.myrxURLTextStyle} isSkeleton={isContentLoading}>
          {myrxURL}
        </BaseText>
      </View>
      <LineSeparator viewStyle={styles.lineSeparatorViewStyle} />
      <BaseText
        style={styles.membersTitleTextStyle}
        isSkeleton={isContentLoading}
      >
        {membersTitle}
      </BaseText>
      <BaseText
        style={styles.membersDescriptionTextStyle}
        isSkeleton={isContentLoading}
      >
        {membersDescription}
      </BaseText>
      <BaseText
        style={styles.claimsTitleTextStyle}
        isSkeleton={isContentLoading}
      >
        {claimsTitle}
      </BaseText>
      <BaseText
        style={styles.claimsDescriptionTextStyle}
        isSkeleton={isContentLoading}
      >
        {claimsDescription}
      </BaseText>
      <BaseText
        style={styles.sendPrescriptionsInstructionTextStyle}
        isSkeleton={isContentLoading}
      >
        {sendPrescriptionsInstruction}
      </BaseText>
      <BaseText
        style={styles.prescryptiveAddressTextStyle}
        isSkeleton={isContentLoading}
      >
        {prescryptiveAddress}
      </BaseText>
    </View>
  );
};
