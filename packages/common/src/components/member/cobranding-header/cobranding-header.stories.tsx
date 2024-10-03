// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { CobrandingHeader, ICobrandingHeaderProps } from './cobranding-header';
import { imageUrlMock } from '../../remote-image-asset/__mocks__/remote-image-asset';

export default {
  title: 'Layout/CobrandingHeader',
  component: CobrandingHeader,
};

const ArgsWrapper: Story<ICobrandingHeaderProps> = (args) => (
  <CobrandingHeader {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  logoUrl: imageUrlMock,
};
