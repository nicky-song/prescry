// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  IServicesStyles,
  servicesLargeStyles,
  servicesMobileStyles,
} from './services.styles';

describe('servicesStyles', () => {
  it('has expected styles', () => {
    const expectedMobileStyles: IServicesStyles = {
      containerViewStyle: {
        maxWidth: 1140,
      },
      cardContainerViewStyle: {
        flexDirection: 'column',
      },
      serviceCardViewStyle: { marginTop: Spacing.base, minHeight: 170 },
      firstServiceCardViewStyle: { marginTop: Spacing.base, minHeight: 170 },
      lastServiceCardViewStyle: { marginTop: Spacing.base, minHeight: 170 },
    };

    const expectedLargeStyles: IServicesStyles = {
      ...servicesMobileStyles,
      containerViewStyle: {
        maxWidth: '100%',
        width: '100%',
        paddingBottom: Spacing.times4,
        marginBottom: Spacing.times4,
      },
      cardContainerViewStyle: {
        ...servicesMobileStyles.cardContainerViewStyle,
        flexDirection: 'row',
      },
      serviceCardViewStyle: {
        ...servicesMobileStyles.serviceCardViewStyle,
        marginTop: 0,
        marginLeft: Spacing.times2,
        marginRight: Spacing.times2,
        flex: 1,
      },
      firstServiceCardViewStyle: {
        ...servicesMobileStyles.serviceCardViewStyle,
        marginTop: 0,
        marginLeft: 0,
        marginRight: Spacing.times2,
        flex: 1,
      },
      lastServiceCardViewStyle: {
        ...servicesMobileStyles.serviceCardViewStyle,
        marginTop: 0,
        marginLeft: Spacing.times2,
        marginRight: 0,
        flex: 1,
      },
    };

    expect(servicesMobileStyles).toEqual(expectedMobileStyles);
    expect(servicesLargeStyles).toEqual(expectedLargeStyles);
  });
});
