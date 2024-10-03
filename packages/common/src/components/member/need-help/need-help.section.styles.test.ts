// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { needHelpSectionStyles } from './need-help.section.styles';

describe('needHelpSectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles = {
      containerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
      iconImageStyle: {
        marginRight: Spacing.half,
      },
    };

    expect(needHelpSectionStyles).toEqual(expectedStyles);
  });
});
