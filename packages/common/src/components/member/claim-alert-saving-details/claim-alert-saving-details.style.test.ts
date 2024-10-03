// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { FontSize } from '../../../theming/theme';
import { claimAlertSavingDetailsStyle } from './claim-alert-saving-details.style';

describe('claimAlertSavingDetailsStyle', () => {
  it('has expected styles', () => {
    const imageContainerView: ViewStyle = {
      alignItems: 'flex-start',
      flexDirection: 'row',
    };
    const imageStyle: ImageStyle = {
      height: 20,
      width: 20,
      resizeMode: 'center',
    };
    const savingDetailsContainer: ViewStyle = {
      height: 'auto',
    };
    const savingDescriptionContainer: ViewStyle = {
      flexDirection: 'column',
      height: 'auto',
      paddingHorizontal: Spacing.times1pt25,
      marginTop: Spacing.times1pt5,
      marginBottom: Spacing.times1pt25,
    };
    const savingDescriptionTextContainer: ViewStyle = {
      alignItems: 'flex-start',
      height: 'auto',
      paddingTop: Spacing.times1pt25,
    };
    const savingText: TextStyle = {
      flex: 5,
      ...getFontFace({ weight: FontWeight.bold }),
      fontSize: FontSize.largest,
      textAlign: 'left',
      marginLeft: Spacing.base,
    };
    const savingPrice: TextStyle = {
      flex: 2,
      ...getFontFace({ weight: FontWeight.bold }),
      textAlign: 'right',
    };
    const savingDescriptionText: TextStyle = {
      ...getFontFace(),
      textAlign: 'left',
    };
    const savingActionTextContainer: ViewStyle = {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    };
    const savingActionText: TextStyle = {
      flexGrow: 0,
      ...getFontFace(),
      textAlign: 'left',
      paddingTop: Spacing.half,
    };
    const savingDetailView: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: Spacing.times1pt25,
      paddingRight: Spacing.times1pt25,
      paddingLeft: Spacing.times1pt25,
      height: 24,
    };

    const expectedStyles = {
      imageStyle,
      imageContainerView,
      savingActionText,
      savingActionTextContainer,
      savingText,
      savingPrice,
      savingDescriptionText,
      savingDescriptionTextContainer,
      savingDescriptionContainer,
      savingDetailsContainer,
      savingDetailView,
    };

    expect(claimAlertSavingDetailsStyle).toEqual(expectedStyles);
  });
});
