// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { BaseText } from '../../text/base-text/base-text';
import { pinFeatureWelcomeScreenContainerStyles } from './pin-feature-welcome-screen-container.styles';

export const PinFeatureWelcomeScreenContainer = (): ReactElement => {
  const groupKey = CmsGroupKey.signIn;
  const { content, isContentLoading } = useContent<ISignInContent>(groupKey, 2);

  const {
    containerViewStyle,
    containerHeaderTextStyle,
    containerInfoTextStyle,
  } = pinFeatureWelcomeScreenContainerStyles;

  return (
    <View style={containerViewStyle} testID='pinFeatureWelcomeScreen'>
      <BaseText
        style={containerHeaderTextStyle}
        weight='medium'
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.containerHeaderText}
      </BaseText>
      <BaseText
        style={containerInfoTextStyle}
        weight='medium'
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.pinWelcomeInfoText1}
      </BaseText>
      <BaseText
        style={containerInfoTextStyle}
        weight='medium'
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.pinWelcomeInfoText2}
      </BaseText>
    </View>
  );
};
