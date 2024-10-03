// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  AllFavoriteNotifications,
  IAllFavoriteNotificationsProps,
} from './all-favorite.notifications';

export default {
  title: 'Notifications/AllFavoriteNotifications',
  component: AllFavoriteNotifications,
  argTypes: { onNotificationClose: { action: 'closed' } },
};

const ArgsWrapper: Story<IAllFavoriteNotificationsProps> = (args) => (
  <AllFavoriteNotifications {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
