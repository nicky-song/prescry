// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { LinkCheckbox, ILinkCheckboxProps } from './link.checkbox';

export default {
  title: 'Checkboxes/LinkCheckbox',
  component: LinkCheckbox,
  argTypes: {
    onLinkPress: { action: 'onLinkPress' },
    onCheckboxPress: { action: 'onCheckboxPress' },
  },
};

const ArgsWrapper: Story<ILinkCheckboxProps> = (args) => (
  <LinkCheckbox {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  markdown:
    'Sample markdown with [a link](alink) and [another link](anotherLink)',
};
