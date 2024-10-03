// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { NotificationColor } from '../../../theming/colors';
import {
  favoriteIconButtonStyles,
  IFavoriteIconButtonStyles,
} from './favorite-icon.button.styles';

describe('favoriteIconButtonStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IFavoriteIconButtonStyles = {
      viewStyle: {
        height: 32,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: NotificationColor.lightRatings,
        borderRadius: BorderRadius.times2,
      },
    };

    expect(favoriteIconButtonStyles).toEqual(expectedStyles);
  });
});
