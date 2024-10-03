// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import {
  configureFiltersScreenStyles,
  IConfigureFiltersScreenStyles,
} from './configure-filters.screen.styles';

describe('configureFiltersScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IConfigureFiltersScreenStyles = {
      bodyContentContainerViewStyle: {
        height: '100%',
      },
      headingTextStyle: { marginBottom: Spacing.base, marginTop: Spacing.half },
      labelTextStyle: {
        marginBottom: Spacing.base,
        marginTop: Spacing.base,
        fontWeight: FontWeight.regular,
      },
      lineSeparatorViewStyle: {
        marginTop: Spacing.times3,
        marginBottom: Spacing.times1pt5,
      },
      radioButtonViewStyle: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.times1pt5,
      },
      radioButtonToggleViewStyle: {
        width: 'fit-content',
        marginTop: Spacing.base,
      },
      checkBoxContainerViewStyle: {
        flexDirection: 'column',
      },
    };

    expect(configureFiltersScreenStyles).toEqual(expectedStyles);
  });
});
