// Copyright 2023 Prescryptive Health, Inc.

import {
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  PrimaryColor,
  GrayScaleColor
} from '../../../theming/colors';
import {
  FontSize,
  FontWeight, 
  getFontDimensions,
  getFontFace
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { IMarkdownTextStyles } from '../../text/markdown-text/markdown-text.styles';
import { IFatalErrorStyles, FatalErrorStyles } from './fatal-error.styles';

describe('FatalErrorStyles', () => {

  it('has expected default style', () => {
    const fatalErrorViewStyle: ViewStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      maxWidth: '100%',
      paddingLeft: Spacing.times3,
      paddingRight: Spacing.times3,
      backgroundColor: GrayScaleColor.white,
    };

    const fatalErrorImageStyle: ImageStyle = {
      height: 250,
      width: 250,
      position: 'relative',
      flexBasis: 'auto',
      flexGrow: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      resizeMode: 'contain',
    };

    const fatalErrorTextStyle: TextStyle = {
      flexGrow: 0,
      textAlign: 'center',
      color: GrayScaleColor.primaryText,
      ...getFontFace(),
      ...getFontDimensions(FontSize.body),
    };

    const subTitleTextStyle: TextStyle = {
      marginBottom: Spacing.base,
      color: GrayScaleColor.primaryText,
      ...getFontFace({
        weight: FontWeight.semiBold
      }),
      ...getFontDimensions(FontSize.body * 1.5),
    };

    const customErrorTextStyle: IMarkdownTextStyles = {
      paragraph: {
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: Spacing.half,
      },
    };

    const linkTextStyle: TextStyle = {
      color: PrimaryColor.prescryptivePurple,
      ...getFontFace({
        weight: FontWeight.semiBold
      }),
      ...getFontDimensions(FontSize.body),
    };

    const expectedStyle : IFatalErrorStyles = {
      fatalErrorViewStyle,
      fatalErrorImageStyle,
      fatalErrorTextStyle,
      subTitleTextStyle,
      customErrorTextStyle,
      linkTextStyle,
    };

    expect(FatalErrorStyles).toEqual(expectedStyle);
  });
});
