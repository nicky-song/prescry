// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  expandableCardStyles,
  IExpandableCardStyles,
} from './expandable.card.styles';

describe('expandableCardStyles', () => {
  it('has expected styles', () => {
    const headingVerticalPadding = Spacing.half;

    const expectedStyles: IExpandableCardStyles = {
      headingContainerViewStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: headingVerticalPadding,
        paddingBottom: headingVerticalPadding,
        marginBottom: Spacing.threeQuarters - headingVerticalPadding,
      },
      expandIconViewStyle: {
        alignSelf: 'center',
        flex: 0,
        flexBasis: 'initial',
      },
      lineSeparatorViewStyle: {
        marginTop: Spacing.times2,
      },
    };

    expect(expandableCardStyles).toEqual(expectedStyles);
  });
});
