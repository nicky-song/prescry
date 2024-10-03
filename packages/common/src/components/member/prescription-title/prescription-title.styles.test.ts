// Copyright 2021 Prescryptive Health, Inc.

import {
  prescriptionTitleStyles,
  IPrescriptionTitleStyles,
} from './prescription-title.styles';
import { Spacing } from '../../../theming/spacing';
import { PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('prescriptionTitleStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPrescriptionTitleStyles = {
      detailsContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: Spacing.half,
        width: '100%',
      },
      detailsTextViewStyle: {
        flex: 4,
      },
      headingTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },

      editButtonViewStyle: {
        marginLeft: 'auto',
      },
      iconTextStyle: {
        flexGrow: 0,
        fontSize: 16,
        color: PrimaryColor.darkBlue,
        marginLeft: Spacing.threeQuarters,
      },
      rowContainerViewStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        width: 'fit-content',
      },
      separatorViewStyle: {
        marginTop: Spacing.base,
      },
      containerViewStyle: {
        width: '100%',
      },
    };

    expect(prescriptionTitleStyles).toEqual(expectedStyles);
  });
});
