// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IContactInfoContainerStyles,
  contactInfoContainerStyles,
} from './contact-info-container.styles';

describe('contactInfoContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IContactInfoContainerStyles = {
      viewStyle: {
        flexDirection: 'column',
        flexGrow: 0,
        padding: Spacing.half,
      },
    };

    expect(contactInfoContainerStyles).toEqual(expectedStyles);
  });
});
