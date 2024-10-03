// Copyright 2021 Prescryptive Health, Inc.

import { FontSize, getFontDimensions } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  IWhatIsNextSectionStyle,
  whatIsNextSectionStyle,
} from './what-is-next.section.styles';

describe('whatIsNextSectionStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: IWhatIsNextSectionStyle = {
      heading2TextStyle: {
        marginBottom: Spacing.half,
        ...getFontDimensions(FontSize.large), 
      },
      separatorViewStyle: {
        marginTop: Spacing.times2,
      },
    };

    expect(whatIsNextSectionStyle).toEqual(expectedStyle);
  });
});
