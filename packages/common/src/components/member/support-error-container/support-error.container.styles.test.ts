// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  ISupportErrorContainerStyles,
  supportErrorContainerStyles,
} from './support-error.container.styles';

describe('supportErrorContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISupportErrorContainerStyles = {
      headingTextStyle: { marginBottom: Spacing.base },
      reloadLinkViewStyle: {
        width: 'fit-content',
        marginTop: Spacing.base,
        marginLeft: -Spacing.base,
      },
    };

    expect(supportErrorContainerStyles).toEqual(expectedStyles);
  });
});
