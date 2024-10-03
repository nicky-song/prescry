// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Heading } from '../../member/heading/heading';
import { ProtectedView } from '../protected-view/protected-view';
import { TranslatableView } from '../translated-view/translatable-view';
import { bodyContentContainerStyles } from './body-content.container.styles';

export interface IBodyContentContainerProps {
  viewStyle?: StyleProp<ViewStyle>;
  title?: ReactNode;
  children: ReactNode;
  testID?: string;
  isSkeleton?: boolean;
  translateTitle?: boolean;
}

export const BodyContentContainer = ({
  title,
  children,
  viewStyle,
  testID,
  isSkeleton,
  translateTitle = true,
}: IBodyContentContainerProps): ReactElement => {

  const heading =
    ((title && typeof title === 'string') || (title === '' && isSkeleton)) ? (
      <Heading
        textStyle={bodyContentContainerStyles.titleViewStyle}
        isSkeleton={isSkeleton}
        skeletonWidth='long'
        translateContent={translateTitle}
      >
        {title}
      </Heading>
    ) : title ? (
      translateTitle ? (
        <TranslatableView style={bodyContentContainerStyles.titleViewStyle}>
          {title}
        </TranslatableView>
      ) : (
        <ProtectedView style={bodyContentContainerStyles.titleViewStyle}>
          {title}
        </ProtectedView>
      )
    ) : null;

  return (
    <View
      style={[bodyContentContainerStyles.viewStyle, viewStyle]}
      testID={testID}
    >
      {heading}
      {children}
    </View>
  );
};
