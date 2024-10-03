// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  listItemButtonStyles,
  IListItemButtonStyles,
} from './list-item.button.styles';

describe('listItemButtonStyles', () => {
  it('has expected styles (default)', () => {
    const expected: IListItemButtonStyles = {
      viewStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: GrayScaleColor.white,
        borderBottomColor: GrayScaleColor.borderLines,
        borderBottomWidth: 1,
        borderRadius: 0,
        paddingTop: Spacing.base,
        paddingBottom: Spacing.base,
        paddingLeft: 0,
        paddingRight: 0,
      },
    };
    expect(listItemButtonStyles).toEqual(expected);
  });
});
