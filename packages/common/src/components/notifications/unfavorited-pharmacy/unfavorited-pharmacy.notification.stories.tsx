// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  UnfavoritedPharmacyNotification,
  IUnfavoritedPharmacyNotificationProps,
} from './unfavorited-pharmacy.notification';

export default {
  title: 'Notifications/UnfavoritedPharmacyNotification',
  component: UnfavoritedPharmacyNotification,
  argTypes: { onClose: { action: 'closed' } },
};

const ArgsWrapper: Story<IUnfavoritedPharmacyNotificationProps> = (args) => (
  <UnfavoritedPharmacyNotification {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
