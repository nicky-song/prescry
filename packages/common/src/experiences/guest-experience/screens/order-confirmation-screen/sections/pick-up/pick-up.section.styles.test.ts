// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  IPickUpSectionStyles,
  pickUpSectionStyles,
} from './pick-up.section.styles';

describe('pickUpSectionStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IPickUpSectionStyles = {
      heading2TextStyle: {
        marginBottom: Spacing.base,
      },
      heading3TextStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
      sectionViewStyle: {
        paddingTop: 0,
        paddingBottom: Spacing.quarter,
      },
      separatorViewStyle: {
        marginBottom: Spacing.times2,
      },
      headingWithFavoriteViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      favoriteIconButtonViewStyle: {
        marginLeft: Spacing.base,
      },
    };

    expect(pickUpSectionStyles).toEqual(expectedStyles);
  });
});
