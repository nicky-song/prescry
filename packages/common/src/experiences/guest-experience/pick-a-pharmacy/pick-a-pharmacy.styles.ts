// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IPickAPharmacyStyles {
  promotionLinkViewStyle: ViewStyle;
  pickYourPharmacyViewStyle: ViewStyle;
  pickYourPharmacyTextStyle: TextStyle;
  modalViewStyle: ViewStyle;
  locationButtonViewStyle: ViewStyle;
  noPharmacyMessageTextStyle: TextStyle;
  pharmacyCardViewStyle: ViewStyle;
  bodyViewStyle: ViewStyle;
  headerViewStyle: ViewStyle;
  lineSeparatorViewStyle: ViewStyle;
  stickyViewStyle: ViewStyle;
  pharmacyGroupViewStyle: ViewStyle;
  alternativeSavingsCardViewStyle: ViewStyle;
  pickYourPharmacySubTextStyle: TextStyle;
  prescribedMedicationViewStyle: ViewStyle;
  forPatientViewStyle: ViewStyle;
}
const stickyContentHeight = 200;

export const pickAPharmacyStyles: IPickAPharmacyStyles = {
  bodyViewStyle: {
    marginBottom: -stickyContentHeight,
    paddingTop: Spacing.half,
    paddingRight: Spacing.times1pt5,
    paddingBottom: Spacing.base,
    paddingLeft: Spacing.times1pt5,
  },
  headerViewStyle: {
    paddingBottom: 0,
  },
  promotionLinkViewStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 0,
    marginBottom: Spacing.half,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  pickYourPharmacyViewStyle: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pickYourPharmacyTextStyle: {
    marginBottom: Spacing.threeQuarters,
  },
  locationButtonViewStyle: { width: 'auto', marginLeft: -Spacing.base },
  modalViewStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noPharmacyMessageTextStyle: {
    marginTop: Spacing.base,
  },
  pharmacyCardViewStyle: {
    marginTop: -1,
    paddingLeft: 0,
    paddingRight: 0,
  },
  lineSeparatorViewStyle: {
    marginTop: Spacing.base,
  },
  stickyViewStyle: {
    backgroundColor: GrayScaleColor.white,
    paddingTop: Spacing.base,
    paddingRight: Spacing.times1pt5,
    paddingLeft: Spacing.times1pt5,
    paddingBottom: Spacing.base,
  },
  pharmacyGroupViewStyle: {
    marginBottom: Spacing.times2,
  },
  alternativeSavingsCardViewStyle: { marginBottom: Spacing.times2 },
  pickYourPharmacySubTextStyle: {
    marginBottom: Spacing.half,
  },
  prescribedMedicationViewStyle: {
    borderRadius: BorderRadius.normal,
    borderWidth: 1,
    borderColor: GrayScaleColor.borderLines,
    padding: Spacing.base,
  },
  forPatientViewStyle: { marginBottom: Spacing.times2 },
};
