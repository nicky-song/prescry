// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { GreyScale, FontSize } from '../../../theming/theme';
import {
  accountInformationScreenStyles,
  IAccountInformationScreenStyle,
} from './account-information-screen.styles';

describe('accountInformationScreenStyles', () => {
  it('has expected styles', () => {
    const headerTextStyle: TextStyle = {
      color: GreyScale.darkest,
      fontSize: FontSize.ultra,
      ...getFontFace({ weight: FontWeight.bold }),
      textAlign: 'left',
    };

    const headerViewStyle: ViewStyle = {
      marginHorizontal: Spacing.times1pt5,
      marginTop: Spacing.times1pt5,
      marginBottom: 0,
    };

    const sectionViewStyle: ViewStyle = {
      marginVertical: Spacing.threeQuarters,
      borderBottomWidth: 1,
      borderBottomColor: GreyScale.light,
    };

    const lastSectionViewStyle: ViewStyle = {
      marginVertical: Spacing.threeQuarters,
    };

    const itemViewStyle: ViewStyle = { marginVertical: Spacing.half };

    const editableItemViewStyle: ViewStyle = {
      ...itemViewStyle,
      flexDirection: 'row',
      justifyContent: 'space-between',
    };

    const bottomSpacing: ViewStyle = { marginBottom: Spacing.threeQuarters };

    const topSpacing: ViewStyle = { marginTop: Spacing.quarter };

    const buttonContainer: ViewStyle = {
      alignItems: 'flex-end',
    };

    const editButtonViewStyle: ViewStyle = {
      paddingLeft: Spacing.base,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    }
    
    const editButtonTextStyle: TextStyle = {
      fontSize: 16,
      lineHeight: 24,
    }

    const secondaryButtonViewStyle: ViewStyle = {
      marginTop: Spacing.times1pt25,
    };

    const saveButtonsViewStyle: ViewStyle = {
      marginTop: Spacing.times4,
    };

    const expectedStyles: IAccountInformationScreenStyle = {
      headerViewStyle,
      headerTextStyle,
      sectionViewStyle,
      itemViewStyle,
      bottomSpacing,
      topSpacing,
      lastSectionViewStyle,
      editableItemViewStyle,
      buttonContainer,
      editButtonViewStyle,
      editButtonTextStyle,
      secondaryButtonViewStyle,
      saveButtonsViewStyle,
    };

    expect(accountInformationScreenStyles).toEqual(expectedStyles);
  });
});
