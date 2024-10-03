// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

const appointmentReceiptViewStyle: ViewStyle = {
  backgroundColor: GrayScaleColor.lightGray,
  borderColor: GrayScaleColor.borderLines,
  borderRadius: BorderRadius.half,
  borderStyle: 'solid',
  borderWidth: 2,
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  flexGrow: 1,
  width: '100%',
};

const appointmentReceiptPharmacyDetailsViewStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: Spacing.times1pt5,
  marginLeft: Spacing.times1pt5,
  marginRight: Spacing.times1pt5,
  borderBottomWidth: 2,
  borderBottomColor: GrayScaleColor.borderLines,
};

const appointmentReceiptPharmacyNameTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.bold }),
  ...getFontDimensions(FontSize.large),
  marginBottom: Spacing.half,
};

const appointmentReceiptPharmacyAddressTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  ...getFontDimensions(FontSize.small),
  color: GrayScaleColor.secondaryGray,
  marginBottom: Spacing.times1pt5,
};

const appointmentReceiptDetailsContainerView: ViewStyle = {
  marginLeft: Spacing.times1pt5,
  marginRight: Spacing.times1pt5,
};

const appointmentReceiptDetailsView: ViewStyle = {
  marginTop: Spacing.times1pt5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const appointmentReceiptItemView: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginBottom: Spacing.times1pt5,
};

const appointmentReceiptItemHeader: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  ...getFontDimensions(FontSize.small),
  color: GrayScaleColor.secondaryGray,
  marginBottom: Spacing.quarter,
  textAlign: 'left',
};

const appointmentReceiptItemValue: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  ...getFontDimensions(FontSize.large),
  textAlign: 'left',
};

const appointmentReceiptCostContainerView: ViewStyle = {
  borderTopWidth: 2,
  borderTopColor: GrayScaleColor.borderLines,
  display: 'flex',
  flexDirection: 'row',
};

const appointmentReceiptChargesContainerView: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const appointmentReceiptChargesItemView: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: Spacing.times2,
  marginBottom: Spacing.base,
};

const appointmentReceiptChargesItemHeader: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  ...getFontDimensions(FontSize.small),
  color: GrayScaleColor.secondaryGray,
  marginBottom: Spacing.quarter,
  textAlign: 'left',
};

const appointmentReceiptChargesItemValue: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  ...getFontDimensions(FontSize.large),
};

const appointmentReceiptTotalsItemView: ViewStyle = {
  ...appointmentReceiptChargesItemView,
  marginLeft: Spacing.base,
};

const appointmentReceiptTotalsItemHeader: TextStyle = {
  ...appointmentReceiptChargesItemHeader,
};

const appointmentReceiptTotalsItemValue: TextStyle = {
  ...appointmentReceiptChargesItemValue,
  ...getFontFace({ weight: FontWeight.bold }),
};

const appointmentReceiptStatusItemView: ViewStyle = {
  ...appointmentReceiptChargesItemView,
  marginTop: 0,
};

const appointmentReceiptStatusItemHeader: TextStyle = {
  ...appointmentReceiptChargesItemHeader,
};

const appointmentReceiptStatusItemValue: TextStyle = {
  ...appointmentReceiptChargesItemValue,
};

const appointmentReceiptStatusContainerView: ViewStyle = {
  ...appointmentReceiptChargesContainerView,
};

const appointmentReceiptExpanderViewStyle: ViewStyle = {
  backgroundColor: GrayScaleColor.lightGray,
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const appointmentReceiptHeaderTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.bold }),
  ...getFontDimensions(FontSize.large),
  margin: Spacing.times1pt5,
  marginLeft: Spacing.times2,
  maxHeight: 24,
};

const appointmentReceiptIconStyle = {
  color: GrayScaleColor.black,
  fontSize: FontSize.large,
  maxHeight: 24,
};

const appointmentReceiptIconContainerStyle: TextStyle = {
  margin: Spacing.times1pt5,
  marginRight: Spacing.times2,
  textAlign: 'right',
};

const appointmentReceiptContainerStyle: ViewStyle = {
  margin: Spacing.times1pt5,
  marginBottom: 0,
};

const toolButtonTextStyle = { fontSize: FontSize.xLarge };
const toolButtonViewStyle = { marginBottom: Spacing.base };

const spinnerViewStyle = { marginBottom: Spacing.base };

export const appointmentReceiptStyles = {
  appointmentReceiptContainerStyle,
  appointmentReceiptViewStyle,
  appointmentReceiptPharmacyDetailsViewStyle,
  appointmentReceiptPharmacyNameTextStyle,
  appointmentReceiptPharmacyAddressTextStyle,
  appointmentReceiptDetailsContainerView,
  appointmentReceiptDetailsView,
  appointmentReceiptItemView,
  appointmentReceiptItemHeader,
  appointmentReceiptItemValue,
  appointmentReceiptCostContainerView,
  appointmentReceiptChargesContainerView,
  appointmentReceiptChargesItemView,
  appointmentReceiptChargesItemHeader,
  appointmentReceiptChargesItemValue,
  appointmentReceiptTotalsItemView,
  appointmentReceiptTotalsItemHeader,
  appointmentReceiptTotalsItemValue,
  appointmentReceiptExpanderViewStyle,
  appointmentReceiptHeaderTextStyle,
  appointmentReceiptIconStyle,
  appointmentReceiptIconContainerStyle,
  appointmentReceiptStatusItemView,
  appointmentReceiptStatusItemHeader,
  appointmentReceiptStatusItemValue,
  appointmentReceiptStatusContainerView,
  toolButtonTextStyle,
  toolButtonViewStyle,
  spinnerViewStyle,
};
