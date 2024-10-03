// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  FooterContentContainer,
  IFooterContentContainerProps,
} from './footer-content.container';
import { BaseButton } from '../../buttons/base/base.button';

export default {
  title: 'Containers/FooterContentContainer',
  component: FooterContentContainer,
};

const ArgsWrapper: Story<IFooterContentContainerProps> = (args) => (
  <FooterContentContainer {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: <BaseButton>Sample Button</BaseButton>,
};

export const FalseColorBackground = ArgsWrapper.bind({});
FalseColorBackground.storyName = 'False color background';
FalseColorBackground.args = {
  children: <BaseButton>Sample Button</BaseButton>,
  viewStyle: {
    backgroundColor: 'lightgray',
  },
};
