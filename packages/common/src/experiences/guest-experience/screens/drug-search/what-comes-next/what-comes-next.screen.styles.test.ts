// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../../../theming/colors';
import { Spacing } from '../../../../../theming/spacing';
import {
  IWhatComesNextScreenStyles,
  whatComesNextScreenStyles,
} from './what-comes-next.screen.styles';

describe('whatComesNextScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IWhatComesNextScreenStyles = {
      separatorViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
      prescriptionAtThisPharmacyViewStyle: {
        backgroundColor: GrayScaleColor.lightGray,
        marginLeft: -Spacing.times1pt5,
        marginRight: -Spacing.times1pt5,
        marginTop: Spacing.times2,
      },
      prescriptionAtAnotherPharmacyViewStyle: {
        marginTop: Spacing.times2,
      },
      newPrescriptionViewStyle: {
        marginTop: Spacing.base,
      },
      customerSupportViewStyle: {
        marginTop: Spacing.times2,
      },
      favoritingNotificationViewStyle: {
        width: '100%',
      },
      bodyContentContainerTitleViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      favoriteIconButtonViewStyle: { marginLeft: Spacing.base },
    };

    expect(whatComesNextScreenStyles).toEqual(expectedStyles);
  });
});
