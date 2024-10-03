// Copyright 2022 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import {
  FontSize,
  FontWeight,
  getFontFace,
  getFontDimensions,
} from '../../../theming/fonts';
import { GreyScale } from '../../../theming/theme';

export interface IContactCaregiverContainerStyles {
  headingTextStyle: ViewStyle;
  subHeadingTextStyle: ViewStyle;
  listViewStyle: ViewStyle;
  listItemViewStyle: ViewStyle;
  listItemTitleStyle: TextStyle;
  reloadLinkViewStyle: ViewStyle;
  helpCardViewStyle: ViewStyle;
  helpLinkTitleViewStyle: ViewStyle;
  helpLinkTitleTextStyle: TextStyle;
  helpLinkInfoViewStyle: ViewStyle;
  helpIconStyle: TextStyle;
  helpLinkInfoTextStyle: TextStyle;
  headerLogoStyle: ImageStyle;
  providedByViewStyle: ViewStyle;
  headerLogoViewStyle: ViewStyle;
}

export const contactCaregiverContainerStyles: IContactCaregiverContainerStyles =
  {
    headingTextStyle: { marginBottom: Spacing.base },
    subHeadingTextStyle: {
      ...getFontDimensions(FontSize.body),
      marginBottom: Spacing.base,
      marginTop: Spacing.base,
    },
    listViewStyle: {
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center',
      flexGrow: 1,
    },
    listItemViewStyle: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: Spacing.base,
    },
    listItemTitleStyle: {
      ...getFontFace({ weight: FontWeight.semiBold }),
      marginRight: Spacing.eighth,
    },
    helpCardViewStyle: {
      height: 'auto',
      borderRadius: Spacing.quarter,
      backgroundColor: GreyScale.lightWhite,
      borderWidth: 0,
      borderColor: GreyScale.lighterDark,
      marginTop: Spacing.base,
      marginBottom: Spacing.base,
      display: 'flex',
      flexDirection: 'column',
    },
    helpLinkTitleViewStyle: {
      display: 'flex',
      flexDirection: 'row',
      margin: Spacing.base,
      marginBottom: Spacing.quarter,
    },
    reloadLinkViewStyle: {
      width: 'fit-content',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    helpLinkTitleTextStyle: {
      ...getFontDimensions(FontSize.body),
      ...getFontFace({ weight: FontWeight.semiBold }),
    },
    helpLinkInfoViewStyle: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: Spacing.base,
      marginLeft: Spacing.times3,
      marginRight: Spacing.base,
      flexWrap: 'wrap',
    },
    helpIconStyle: {
      marginRight: Spacing.base,
    },
    helpLinkInfoTextStyle: {
      ...getFontDimensions(FontSize.body),
      ...getFontFace({ weight: FontWeight.semiBold }),
      marginLeft: Spacing.quarter,
    },
    headerLogoStyle: {
      width: 128,
      height: 48,
    },
    providedByViewStyle: {
      marginBottom: 48,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    headerLogoViewStyle: {
      height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      marginTop: 16,
      marginBottom: 32,
      alignItems: 'center',
    },
  };
