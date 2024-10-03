// Copyright 2022 Prescryptive Health, Inc.

import {
  allFavoriteNotificationsStyles,
  IAllFavoriteNotificationsStyles,
} from './all-favorite.notifications.styles';

describe('allFavoriteNotificationsStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAllFavoriteNotificationsStyles = {
      favoritingNotificationViewStyle: {
        width: '100%',
      },
    };

    expect(allFavoriteNotificationsStyles).toEqual(expectedStyles);
  });
});
