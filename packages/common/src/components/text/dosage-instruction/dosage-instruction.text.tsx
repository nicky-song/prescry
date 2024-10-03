// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../base-text/base-text';
import { dosageInstructionTextStyles } from './dosage-instruction.text.styles';

export interface IDosageInstructionTextProps {
  viewStyle?: StyleProp<ViewStyle>;
  instruction: string;
  isSkeleton?: boolean;
}

export const DosageInstructionText = ({
  viewStyle,
  instruction,
  isSkeleton,
}: IDosageInstructionTextProps): ReactElement => {
  const styles = dosageInstructionTextStyles;

  return (
    <View style={[styles.viewStyle, viewStyle]} testID='dosageInstructionText'>
      <FontAwesomeIcon
        name='prescription-bottle'
        style={styles.iconTextStyle}
      />
      <BaseText
        style={styles.instructionTextStyle}
        isSkeleton={isSkeleton}
        skeletonWidth='long'
      >
        {instruction}
      </BaseText>
    </View>
  );
};
