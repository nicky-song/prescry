// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ILoadingOverlayStyles {
  messageContainerViewStyle: ViewStyle;
  messageTextStyle: TextStyle;
  doNotRefreshTextStyle: TextStyle;
  spinnerColorTextStyle: Pick<TextStyle, 'color'>;
  contentViewStyle: ViewStyle;
}

const commonTextStyle: TextStyle = {
  color: GrayScaleColor.white,
  textAlign: 'center',
  marginBottom: Spacing.half,
};

export const loadingOverlayStyles: ILoadingOverlayStyles = {
  messageContainerViewStyle: {
    marginBottom: Spacing.times2,
  },
  messageTextStyle: {
    ...commonTextStyle,
    fontSize: FontSize.body,
  },
  doNotRefreshTextStyle: {
    ...commonTextStyle,
    fontSize: FontSize.large,
  },
  spinnerColorTextStyle: {
    color: GrayScaleColor.white,
  },
  contentViewStyle: {
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GrayScaleColor.black,
    opacity: 0.75,
  },
};
