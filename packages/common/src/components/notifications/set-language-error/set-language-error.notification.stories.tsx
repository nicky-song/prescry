// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  SetLanguageErrorNotification,
  ISetLanguageErrorNotificationProps,
} from './set-language-error.notification';

export default {
  title: 'Notifications/SetLanguageErrorNotification',
  component: SetLanguageErrorNotification,
  argTypes: { onClose: { action: 'closed' } },
};

const ArgsWrapper: Story<ISetLanguageErrorNotificationProps> = (args) => (
  <SetLanguageErrorNotification {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
