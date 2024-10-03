// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  footerContentContainerStyles,
  IFooterContentContainerStyles,
} from './footer-content.container.styles';

describe('footerContentContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyle: IFooterContentContainerStyles = {
      viewStyle: {
        paddingTop: Spacing.times2,
        paddingRight: Spacing.times1pt5,
        paddingBottom: Spacing.times2,
        paddingLeft: Spacing.times1pt5,
        width: '100%',
      },
    };

    expect(footerContentContainerStyles).toEqual(expectedStyle);
  });
});
