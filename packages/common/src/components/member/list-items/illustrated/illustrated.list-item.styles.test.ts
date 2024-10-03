// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  IIllustratedListItemStyles,
  illustratedListItemStyles,
} from './illustrated.list-item.styles';

describe('illustratedListItemStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IIllustratedListItemStyles = {
      descriptionTextStyle: {
        marginLeft: Spacing.base,
      },
      viewStyle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
    };

    expect(illustratedListItemStyles).toEqual(expectedStyles);
  });
});
