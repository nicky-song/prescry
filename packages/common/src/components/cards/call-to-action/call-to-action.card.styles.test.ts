// Copyright 2022 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  ICallToActionCardStyles,
  callToActionCardStyles,
} from './call-to-action.card.styles';

describe('callToActionCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ICallToActionCardStyles = {
      tagListViewStyle: {
        marginBottom: Spacing.base,
      },
      headingTextStyle: {
        marginBottom: Spacing.threeQuarters,
      },
      buttonViewStyle: {
        marginTop: Spacing.base,
      },
      linkColorTextStyle: {
        color: PrimaryColor.darkBlue,
      },
      linkViewStyle: {
        width: 'fit-content',
        marginTop: Spacing.half,
      },
      separatorViewStyle: {
        marginTop: Spacing.times1pt25,
      },
    };

    expect(callToActionCardStyles).toEqual(expectedStyles);
  });
});
