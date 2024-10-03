// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import {
  findLocationScreenStyles,
  IFindLocationScreenStyles,
} from './find-location.screen.styles';

describe('findLocationScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IFindLocationScreenStyles = {
      bodyContentContainerViewStyle: {
        height: '100%',
      },
      headingTextStyle: {
        marginBottom: Spacing.times1pt5,
        marginTop: Spacing.half,
      },
      autocompleteViewStyle: {
        marginBottom: Spacing.times1pt5,
      },
    };

    expect(findLocationScreenStyles).toEqual(expectedStyles);
  });
});
