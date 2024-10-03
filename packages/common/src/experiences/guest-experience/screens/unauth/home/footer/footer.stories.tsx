// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { Footer } from './footer';

export default {
  title: 'Unauth/Home/Footer',
  component: Footer,
  args: {},
};

const ArgsWrapper: Story = () => <Footer />;

export const Default = ArgsWrapper.bind({});
Default.args = {};
