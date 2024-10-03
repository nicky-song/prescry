// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { GreyScale, FontSize, RedScale } from '../../../../theming/theme';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from '../../../text/markdown-text/markdown-text.styles';
import {
  IAddressSingleSelectStyles,
  addressSingleSelectStyles,
} from './address-single-select.styles';

describe('addressSingleSelectStyles', () => {
  it('has expected default styles', () => {
    const mandatoryIconTextStyle: IMarkdownTextStyles = {
      ...markdownTextStyles,
      s: { color: RedScale.regular, textDecorationLine: 'none' },
    };

    const errorTextStyle: TextStyle = {
      padding: 0,
      color: RedScale.regular,
      fontSize: FontSize.small,
      ...getFontFace(),
      marginTop: Spacing.threeQuarters,
    };
    const markdownlabelTextStyle: TextStyle = {
      color: GreyScale.darker,
      ...getFontFace({ weight: FontWeight.semiBold }),
      flexGrow: 0,
      marginBottom: Spacing.threeQuarters,
    };

    const statePickerContainerViewStyle: ViewStyle = {
      width: '100%',
    };

    const addressSingleSelectViewStyle: ViewStyle = {
      flex: 1,
      justifyContent: 'flex-start',
    };

    const expectedStyles: IAddressSingleSelectStyles = {
      errorTextStyle,
      markdownlabelTextStyle,
      statePickerContainerViewStyle,
      addressSingleSelectViewStyle,
      mandatoryIconTextStyle,
    };

    expect(addressSingleSelectStyles).toEqual(expectedStyles);
  });
});
