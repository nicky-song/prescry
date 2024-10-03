// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  FavoritingErrorNotification,
  IFavoritingErrorNotificationProps,
} from './favoriting-error.notification';

export default {
  title: 'Notifications/FavoritingErrorNotification',
  component: FavoritingErrorNotification,
  argTypes: { onClose: { action: 'closed' } },
};

const ArgsWrapper: Story<IFavoritingErrorNotificationProps> = (args) => (
  <FavoritingErrorNotification {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
