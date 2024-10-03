// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../../../theming/colors';
import { Spacing } from '../../../../../theming/spacing';
import { GreyScale } from '../../../../../theming/theme';
import {
  drugSearchHomeScreenStyle,
  IDrugSearchHomeScreenStyles,
} from './drug-search-home.screen.style';

describe('drugSearchHomeScreenStyle', () => {
  it('has expected styles', () => {
    const expectedDrugSearchHomeScreenStyle: IDrugSearchHomeScreenStyles = {
      searchTextViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: GrayScaleColor.white,
        marginLeft: -Spacing.times1pt5,
        marginBottom: Spacing.base,
      },
      deleteIconHolderViewStyle: {
        paddingRight: Spacing.threeQuarters,
        paddingLeft: Spacing.base,
        position: 'absolute',
        right: Spacing.times3,
        height: 48,
        marginRight: -Spacing.times3,
        justifyContent: 'center',
      },
      deleteIconTextStyle: { maxHeight: 16, width: 16, color: GreyScale.light }, // TODO: Need color in palette for icon
      noResultsTextStyle: { marginLeft: Spacing.times1pt5 },
      spinnerViewStyle: { marginTop: Spacing.times1pt5 },
    };

    expect(drugSearchHomeScreenStyle).toEqual(
      expectedDrugSearchHomeScreenStyle
    );
  });
});
