// Copyright 2020 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  ISupportContactContainerStyles,
  supportContactContainerStyles,
} from './support-contact-container.style';

describe('supportContactContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISupportContactContainerStyles = {
      iconTextStyle: {
        alignSelf: 'center',
        color: PrimaryColor.darkBlue,
        flex: 0,
        marginRight: Spacing.half,
      },
      linkTextStyle: {
        borderBottomWidth: 0,
        color: PrimaryColor.darkBlue,
      },
      memberPortalViewStyle: { marginTop: Spacing.base },
      rowViewStyle: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginTop: Spacing.threeQuarters,
        marginBottom: Spacing.base,
      },
    };

    expect(supportContactContainerStyles).toEqual(expectedStyles);
  });
});
