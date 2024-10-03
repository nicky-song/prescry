// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  summarySectionStyle,
  ISummarySectionStyle,
} from './summary.section.style';

describe('summarySectionStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: ISummarySectionStyle = {
      dataTextStyle: {
        marginBottom: Spacing.threeQuarters,
        textAlign: 'right',
      },
      labelTextStyle: {
        marginBottom: Spacing.threeQuarters,
      },
      heading2TextStyle: {
        marginBottom: Spacing.base,
      },
      rowViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      sectionViewStyle: {
        paddingTop: 0,
        paddingBottom: Spacing.times1pt5,
      },
      separatorViewStyle: {
        marginBottom: Spacing.times2,
      },
    };

    expect(summarySectionStyle).toEqual(expectedStyle);
  });
});
