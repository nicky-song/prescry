// Copyright 2020 Prescryptive Health, Inc.

import { bookTestCardStyle, IBookTestCardStyle } from './book-test-card.style';
import { TextStyle, ViewStyle } from 'react-native';
import { FontSize, GreyScale } from '../../../../theming/theme';
import { markdownTextStyles } from '../../../text/markdown-text/markdown-text.styles';
import { FontWeight, getFontFace } from '../../../../theming/fonts';

describe('bookTestCardStyle', () => {
  it('has expected styles', () => {
    const fontColor = GreyScale.lightDark;

    const contentContainerViewStyle: ViewStyle = {
      height: 'auto',
      backgroundColor: GreyScale.lightWhite,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: GreyScale.lightWhite,
      padding: 24,
      flexDirection: 'row',
    };

    const headerViewStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'space-around',
    };

    const titleTextStyle: TextStyle = {
      color: fontColor,
      fontSize: FontSize.regular,
      ...getFontFace({ weight: FontWeight.bold }),
      textAlign: 'left',
      flexBasis: '80%',
      flexWrap: 'wrap',
    };

    const priceTextStyle: TextStyle = {
      color: fontColor,
      fontSize: FontSize.small,
      ...getFontFace({ weight: FontWeight.bold }),
      textAlign: 'right',
      flexBasis: '20%',
    };

    const descriptionTextStyle: TextStyle = {
      color: fontColor,
      textAlign: 'left',
      marginVertical: 8,
    };

    const calloutLabelTextStyle: TextStyle = {
      color: fontColor,
      fontSize: FontSize.regular,
      ...getFontFace({ weight: FontWeight.bold }),
      textAlign: 'left',
    };

    const textContainerViewStyle: ViewStyle = {
      flexDirection: 'column',
      display: 'flex',
      flexGrow: 1,
      flex: 1,
    };

    const iconContainerViewStyle: ViewStyle = {
      flexDirection: 'column',
      display: 'flex',
      flexBasis: 20,
      flexGrow: 0,
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'center',
    };

    const iconViewStyle: ViewStyle = {
      width: 26,
      height: 26,
      maxHeight: 26,
      alignItems: 'flex-end',
    };

    const iconStyle = {
      color: GreyScale.darkest,
      fontSize: FontSize.larger,
    };

    const markdownTextStyle = {
      ...markdownTextStyles,
      bullet_list_icon: {
        alignSelf: 'baseline',
        marginLeft: 0,
      },
    };

    const expectedStyles: IBookTestCardStyle = {
      contentContainerViewStyle,
      calloutLabelTextStyle,
      descriptionTextStyle,
      titleTextStyle,
      priceTextStyle,
      headerViewStyle,
      textContainerViewStyle,
      iconContainerViewStyle,
      iconViewStyle,
      iconStyle,
      markdownTextStyle,
    };

    expect(bookTestCardStyle).toEqual(expectedStyles);
  });
});
