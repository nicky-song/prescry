// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import {
  prescriptionPharmacyInfoStyles,
  IPrescriptionPharmacyInfoStyles,
} from './prescription-pharmacy-info.styles';
import { Spacing } from '../../../theming/spacing';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { PrimaryColor } from '../../../theming/colors';

describe('prescriptionPharmacyInfoStyles', () => {
  it('has expected styles', () => {
    const commonIconTextStyle: TextStyle = {
      lineHeight: 30,
      marginRight: Spacing.threeQuarters,
      flexGrow: 0,
      color: PrimaryColor.darkBlue,
    };

    const expectedStyle: IPrescriptionPharmacyInfoStyles = {
      rowViewStyle: {
        flexDirection: 'row',
        marginBottom: Spacing.half,
        alignItems: 'center',
      },
      iconTextStyle: {
        ...commonIconTextStyle,
      },
      phoneIconTextStyle: {
        ...commonIconTextStyle,
      },
      titleTextStyle: {
        ...getFontDimensions(FontSize.h3),
        marginBottom: Spacing.base,
      },
      titleContentWithFavoriteViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      favoriteIconButtonViewStyle: {
        marginLeft: Spacing.base,
        marginBottom: Spacing.half,
      },
      commonTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        color: PrimaryColor.darkBlue,
      },
    };
    expect(prescriptionPharmacyInfoStyles).toEqual(expectedStyle);
  });
});
