// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  IServicesListStyles,
  servicesListStyles,
} from './services-list.styles';

describe('servicesListStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IServicesListStyles = {
      bookTestCardViewStyle: { marginBottom: Spacing.base },
    };

    expect(servicesListStyles).toEqual(expectedStyles);
  });
});
