// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { ImageInstanceNames } from '../../../theming/assets';
import { BaseButton } from '../../buttons/base/base.button';
import { ImageAsset } from '../../image-asset/image-asset';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { Heading } from '../../member/heading/heading';
import { StrokeCard } from '../stroke/stroke.card';
import { actionCardStyles } from './action.card.styles';

export interface IActionCardButtonProps {
  label: string;
  onPress: () => void;
}

export interface IActionCardProps {
  imageName?: ImageInstanceNames;
  title: string;
  headingLevel?: number;
  subTitle: string;
  button?: IActionCardButtonProps;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
  isSkeleton?: boolean;
  isSingleton?: boolean;
}

export const ActionCard = ({
  imageName,
  title,
  headingLevel = 3,
  subTitle,
  button,
  viewStyle,
  testID,
  isSkeleton,
  isSingleton,
}: IActionCardProps): ReactElement => {
  const imageContent = imageName ? (
    <ImageAsset
      name={imageName}
      resizeMode='contain'
      style={actionCardStyles.imageStyle}
    />
  ) : null;

  const buttonContent = button ? (
    <BaseButton
      size='medium'
      onPress={button.onPress}
      viewStyle={actionCardStyles.buttonViewStyle}
      testID={testID}
      isSkeleton={isSkeleton}
      skeletonWidth={'medium'}
    >
      {button.label}
    </BaseButton>
  ) : null;

  return (
    <StrokeCard viewStyle={viewStyle} isSingleton={isSingleton}>
      <View style={actionCardStyles.contentContainerViewStyle}>
        {imageContent}
        <Heading
          level={headingLevel}
          isSkeleton={isSkeleton}
          skeletonWidth={'medium'}
        >
          {title}
        </Heading>
        <MarkdownText
          textStyle={actionCardStyles.subTitleTextStyle}
          isSkeleton={isSkeleton}
        >
          {subTitle}
        </MarkdownText>
        {buttonContent}
      </View>
    </StrokeCard>
  );
};
