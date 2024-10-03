// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  bodyContentContainerStyles,
  IBodyContentContainerStyles,
} from './body-content.container.styles';

describe('bodyContentContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyle: IBodyContentContainerStyles = {
      titleViewStyle: {
        marginBottom: Spacing.base,
      },
      viewStyle: {
        paddingTop: Spacing.times1pt5,
        paddingRight: Spacing.times1pt5,
        paddingBottom: Spacing.times2,
        paddingLeft: Spacing.times1pt5,
      },
    };

    expect(bodyContentContainerStyles).toEqual(expectedStyle);
  });
});
