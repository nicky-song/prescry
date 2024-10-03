// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  SmartPriceLearnMoreModal,
  ISmartPriceLearnMoreModalProps,
} from './smart-price.learn-more-modal';

export default {
  title: 'Modals/SmartPriceLearnMoreModal',
  component: SmartPriceLearnMoreModal,
  argTypes: { onPressHandler: { action: 'pressed' } },
};

const ArgsWrapper: Story<ISmartPriceLearnMoreModalProps> = (args) => (
  <SmartPriceLearnMoreModal {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  showModal: true,
};
