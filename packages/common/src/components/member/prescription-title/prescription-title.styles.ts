// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';

export interface IPrescriptionTitleStyles {
  iconTextStyle: TextStyle;
  headingTextStyle: TextStyle;
  rowContainerViewStyle: ViewStyle;
  separatorViewStyle: ViewStyle;
  detailsContainerViewStyle: ViewStyle;
  editButtonViewStyle: ViewStyle;
  containerViewStyle: ViewStyle;
  detailsTextViewStyle: ViewStyle;
}

export const prescriptionTitleStyles: IPrescriptionTitleStyles = {
  detailsContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: Spacing.half,
    width: '100%',
  },
  detailsTextViewStyle: {
    flex: 4,
  },
  headingTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
  },

  editButtonViewStyle: {
    marginLeft: 'auto',
  },
  iconTextStyle: {
    flexGrow: 0,
    fontSize: 16,
    color: PrimaryColor.darkBlue,
    marginLeft: Spacing.threeQuarters,
  },
  rowContainerViewStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 'fit-content',
  },
  separatorViewStyle: {
    marginTop: Spacing.base,
  },
  containerViewStyle: {
    width: '100%',
  },
};
