// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { IPopupModalStyles, popupModalstyles } from './popup-modal.styles';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { BorderRadius } from '../../../theming/borders';

describe('popupModalstyles', () => {
  it('has expected default styles', () => {
    const contentContainerViewStyle: ViewStyle = {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'row',
      paddingTop: Spacing.half,
      paddingBottom: Spacing.times1pt5,
    };

    const modalContainerViewStyle: ViewStyle = {
      alignItems: 'center',
      backgroundColor: 'rgba(52,52,52,0.5)',
      bottom: 0,
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    };

    const modalInnerContainerViewStyle: ViewStyle = {
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
      alignItems: 'center',
    };

    const secondaryButtonViewStyle: ViewStyle = {
      marginTop: Spacing.base,
    };

    const textFieldsViewStyle: ViewStyle = {
      alignSelf: 'center',
      flexGrow: 1,
      marginBottom: Spacing.times2,
      marginTop: 0,
      width: '100%',
    };

    const titleTextStyle: TextStyle = {
      marginBottom: Spacing.base,
    };

    const mediumButtonViewStyle: ViewStyle = {
      alignSelf: 'flex-end',
    };

    const expectedStyles: IPopupModalStyles = {
      modalContainerViewStyle,
      modalInnerContainerViewStyle,
      contentContainerViewStyle,
      mediumButtonViewStyle,
      secondaryButtonViewStyle,
      textFieldsViewStyle,
      titleTextStyle,
    };

    expect(popupModalstyles).toEqual(expectedStyles);
  });
});
