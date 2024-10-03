// Copyright 2020 Prescryptive Health, Inc.

import {
  IPharmacyLocationsScreenStyle,
  pharmacyLocationsScreenStyle,
} from './pharmacy-locations-screen.style';
import { FontSize, GreyScale } from '../../../theming/theme';
import { Spacing } from '../../../theming/spacing';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('pharmacyLocationsScreenStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IPharmacyLocationsScreenStyle = {
      pharmacyLocationsHeaderTextStyle: {
        color: GreyScale.darkest,
        fontSize: FontSize.ultra,
        ...getFontFace({ weight: FontWeight.bold }),
        textAlign: 'left',
        margin: Spacing.times1pt5,
      },
      pharmacyLocationsScreenHeaderViewStyle: {
        alignItems: 'stretch',
        alignSelf: 'stretch',
        flexGrow: 0,
      },
    };

    expect(pharmacyLocationsScreenStyle).toEqual(expectedStyles);
  });
});
