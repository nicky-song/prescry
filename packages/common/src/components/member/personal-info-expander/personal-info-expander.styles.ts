// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { IconSize } from '../../../theming/icons';

export interface IPersonalInfoExpanderStyles {
  itemRowViewStyle: ViewStyle;
  rowNameTextStyle: TextStyle;
  rowValueTextStyle: TextStyle;
  contentViewStyle: ViewStyle;
  headerTextStyle: TextStyle;
  headerViewStyle: ViewStyle;
  iconTextStyle: TextStyle;
  iconContainerTextStyle: TextStyle;
  viewStyle: ViewStyle;
}

const viewStyle: ViewStyle = {
  backgroundColor: GrayScaleColor.lightGray,
  flexDirection: 'row',
  flex: 1,
  justifyContent: 'space-between',
};

export const personalInfoExpanderStyles: IPersonalInfoExpanderStyles = {
  itemRowViewStyle: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
  },
  rowNameTextStyle: {
    flexBasis: 100,
    flexGrow: 0,
    flexShrink: 0,
    ...getFontFace({ weight: FontWeight.bold }),
    marginTop: 20,
  },
  rowValueTextStyle: {
    flexGrow: 1,
    ...getFontDimensions(FontSize.small),
    ...getFontFace({ weight: FontWeight.bold }),
    marginTop: 20,
  },
  contentViewStyle: {
    flexDirection: 'column',
    flexGrow: 1,
    marginBottom: 20,
  },
  headerTextStyle: {
    ...getFontFace({ weight: FontWeight.bold }),
    margin: 20,
  },
  headerViewStyle: viewStyle,
  iconTextStyle: {
    fontSize: IconSize.regular,
  },
  iconContainerTextStyle: {
    margin: 20,
    textAlign: 'right',
  },
  viewStyle,
};
