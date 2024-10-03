// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  FavoritedPharmacyNotification,
  IFavoritedPharmacyNotificationProps,
} from './favorited-pharmacy.notification';

export default {
  title: 'Notifications/FavoritedPharmacyNotification',
  component: FavoritedPharmacyNotification,
  argTypes: { onClose: { action: 'closed' } },
};

const ArgsWrapper: Story<IFavoritedPharmacyNotificationProps> = (args) => (
  <FavoritedPharmacyNotification {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
