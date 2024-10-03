// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  ILoadingOverlayStyles,
  loadingOverlayStyles,
} from './loading.overlay.styles';

describe('loadingOverlayStyles', () => {
  it('has expected styles', () => {
    const commonTextStyle: TextStyle = {
      color: GrayScaleColor.white,
      textAlign: 'center',
      marginBottom: Spacing.half,
    };

    const expectedStyles: ILoadingOverlayStyles = {
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

    expect(loadingOverlayStyles).toEqual(expectedStyles);
  });
});
