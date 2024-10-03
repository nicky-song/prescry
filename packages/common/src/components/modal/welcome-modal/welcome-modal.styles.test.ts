// Copyright 2022 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  IWelcomeModalStyles,
  welcomeModalStyles,
} from './welcome-modal.styles';

describe('welcomeModalStyles', () => {
  it('should have expected styles', () => {
    const outerContainerViewStyle: ViewStyle = {
      alignItems: 'center',
      backgroundColor: 'rgba(52,52,52,0.5)',
      bottom: 0,
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    };

    const modalViewStyle: ViewStyle = {
      width: 'calc(100% - 64px)',
      backgroundColor: GrayScaleColor.white,
      marginTop: '30%',
      marginBottom: 'auto',
      paddingLeft: Spacing.times1pt5,
      paddingRight: Spacing.times1pt5,
      paddingTop: Spacing.times2,
      paddingBottom: Spacing.times2,
      borderRadius: BorderRadius.times1pt5,
      flexGrow: 0,
      flexBasis: 'auto',
      maxWidth: 400,
    };

    const contentContainerTextStyle: TextStyle = {
      marginTop: Spacing.half,
      marginBottom: Spacing.times1pt5,
    };

    const brandImageStyle: ImageStyle = {
      width: 72,
      height: '100%',
      flexGrow: 0,
    };

    const brandMyPrescryptiveImageStyle: ImageStyle = {
      flexGrow: 1,
      height: 45,
      marginTop: -Spacing.half,
      marginRight: 20,
    };

    const logoHolderViewStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.base,
      minHeight: 24,
    };

    const expectedWelcomeModalStyles: IWelcomeModalStyles = {
      contentContainerTextStyle,
      outerContainerViewStyle,
      modalViewStyle,
      brandImageStyle,
      brandMyPrescryptiveImageStyle,
      logoHolderViewStyle,
    };

    expect(welcomeModalStyles).toEqual(expectedWelcomeModalStyles);
  });
});
