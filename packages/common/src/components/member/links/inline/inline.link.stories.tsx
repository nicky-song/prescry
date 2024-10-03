// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { InlineLink, IInlineLinkProps } from './inline.link';
import { BaseText } from '../../../text/base-text/base-text';

export default {
  title: 'Links/InlineLink',
  component: InlineLink,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IInlineLinkProps> = (args) => (
  <BaseText>
    Before <InlineLink {...args} /> after
  </BaseText>
);

export const Enabled = ArgsWrapper.bind({});
Enabled.args = {
  children: 'sample link text',
  disabled: false,
};

export const Disabled = ArgsWrapper.bind({});
Disabled.args = {
  children: 'sample link text',
  disabled: true,
};
