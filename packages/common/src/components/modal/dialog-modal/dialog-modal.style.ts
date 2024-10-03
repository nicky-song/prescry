// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IDialogModalStyles {
  bodyContainerViewStyle: ViewStyle;
  iconButtonTextStyle: TextStyle;
  modalContainerViewStyle: ViewStyle;
  modalInnerContainerViewStyle: ViewStyle;
  headerContainerViewStyle: ViewStyle;
  closeBtnContainer: ViewStyle;
  footerContainerViewStyle: ViewStyle;
}

export const dialogModalStyles: IDialogModalStyles = {
  bodyContainerViewStyle: {
    paddingLeft: Spacing.times3,
    paddingRight: Spacing.times3,
    paddingTop: Spacing.times2pt5,
    paddingBottom: Spacing.times3,
    width: '100%',
  },
  iconButtonTextStyle: {
    fontSize: 20,
  },
  modalContainerViewStyle: {
    alignItems: 'center',
    backgroundColor: 'rgba(52,52,52,0.3)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100vw',
  },
  modalInnerContainerViewStyle: {
    width: 'calc(100% - 64px)',
    backgroundColor: GrayScaleColor.white,
    marginTop: Spacing.times8,
    marginBottom: 'auto',
    flexGrow: 0,
    flexBasis: 'auto',
    alignItems: 'center',
  },
  headerContainerViewStyle: {
    backgroundColor: GrayScaleColor.lightGray,
    maxHeight: 96,
    width: '100%',
    borderTopLeftRadius: BorderRadius.times3,
    borderTopRightRadius: BorderRadius.times3,
    paddingLeft: Spacing.times3,
    paddingRight: Spacing.times3,
    paddingTop: Spacing.times1pt5,
    paddingBottom: Spacing.times1pt5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtnContainer: {
    marginRight: -Spacing.base,
    flexGrow: 0,
  },
  footerContainerViewStyle: {
    width: '100%',
    paddingLeft: Spacing.times3,
    paddingRight: Spacing.times3,
  },
};
