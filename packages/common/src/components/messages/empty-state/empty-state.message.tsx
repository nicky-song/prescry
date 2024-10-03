// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ImageInstanceNames } from '../../../theming/assets';
import { ImageAsset } from '../../image-asset/image-asset';
import { BaseText } from '../../text/base-text/base-text';

import { emptyStateMessageStyles } from './empty-state.message.styles';

export type BottomSpacing = 'regular' | 'wide';

export interface IEmptyStateMessageProps {
  imageName: ImageInstanceNames;
  message: string;
  bottomSpacing?: BottomSpacing;
  isSkeleton?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
}

export const EmptyStateMessage = ({
  imageName,
  message,
  bottomSpacing = 'regular',
  isSkeleton,
  viewStyle,
}: IEmptyStateMessageProps): ReactElement => {
  const bottomSpacingTextStyle =
    bottomSpacing === 'wide'
      ? emptyStateMessageStyles.bottomWideTextStyle
      : emptyStateMessageStyles.bottomRegularTextStyle;

  return (
    <View
      testID='emptyStateMessage'
      style={[
        emptyStateMessageStyles.containerViewStyle,
        bottomSpacingTextStyle,
        viewStyle,
      ]}
    >
      <ImageAsset
        name={imageName}
        style={emptyStateMessageStyles.imageStyle}
        resizeMode='contain'
      />
      <BaseText
        isSkeleton={isSkeleton}
        style={emptyStateMessageStyles.messageTextStyle}
      >
        {message}
      </BaseText>
    </View>
  );
};
