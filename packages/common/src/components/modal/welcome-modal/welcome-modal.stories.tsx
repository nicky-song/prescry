// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IWelcomeModalProps, WelcomeModal } from './welcome-modal';

export default {
  title: 'modals/WelcomeModal',
  component: WelcomeModal,
};

const ArgsWrapper: Story<IWelcomeModalProps> = (args) => (
  <WelcomeModal {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = { rxGroup: 'COB01' };

export const WithBrokerId = ArgsWrapper.bind({});
WithBrokerId.storyName = 'With broker ID';
WithBrokerId.args = {
  brokerId: 'COB02',
};

export const WithRxGroupAndBrokerId = ArgsWrapper.bind({});
WithRxGroupAndBrokerId.storyName = 'With rxGroup and broker ID';
WithRxGroupAndBrokerId.args = {
  rxGroup: 'COB01',
  brokerId: 'COB02',
};
