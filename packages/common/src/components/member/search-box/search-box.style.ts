// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { Spacing } from '../../../theming/spacing';
import { GreyScale, PurpleScale } from '../../../theming/theme';
export interface ISearchBoxStyle {
  searchSectionStyle: ViewStyle;
  searchIconHolderStyle: ViewStyle;
  searchIconHolderStyleDisabled: ViewStyle;
  searchIconHolderStyleEnabled: TextStyle;
  searchIconStyle: TextStyle;
}

export const searchBoxStyle: ISearchBoxStyle = {
  searchSectionStyle: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: GreyScale.lightest,
  },
  searchIconHolderStyle: {
    position: 'absolute',
    right: 40,
    height: 48,
    marginRight: -Spacing.base,
    borderWidth: 1,
    borderTopRightRadius: BorderRadius.normal,
    borderBottomRightRadius: BorderRadius.normal,
    justifyContent: 'center',
  },
  searchIconHolderStyleDisabled: {
    paddingRight: Spacing.base,
    paddingLeft: Spacing.base,
    position: 'absolute',
    right: 40,
    height: 48,
    marginRight: -Spacing.times2pt5,
    borderWidth: 1,
    borderTopRightRadius: BorderRadius.normal,
    borderBottomRightRadius: BorderRadius.normal,
    justifyContent: 'center',
    borderColor: GreyScale.lighter,
    backgroundColor: GreyScale.lighter,
  },
  searchIconHolderStyleEnabled: {
    paddingRight: Spacing.base,
    paddingLeft: Spacing.base,
    position: 'absolute',
    right: 40,
    height: 48,
    marginRight: -Spacing.times2pt5,
    borderWidth: 1,
    borderTopRightRadius: BorderRadius.normal,
    borderBottomRightRadius: BorderRadius.normal,
    justifyContent: 'center',
    borderColor: PurpleScale.darkest,
    backgroundColor: PurpleScale.darkest,
  },
  searchIconStyle: { maxHeight: 16, width: 16, color: GreyScale.lightest },
};
