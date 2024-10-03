// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  InformationButton,
  IInformationButtonProps,
} from './information.button';

export default {
  title: 'Buttons/InformationButton',
  component: InformationButton,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IInformationButtonProps> = (args) => (
  <InformationButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
