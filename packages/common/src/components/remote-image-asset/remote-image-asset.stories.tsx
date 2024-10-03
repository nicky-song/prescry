// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IRemoteImageAssetProps, RemoteImageAsset } from './remote-image-asset';
import { imageUrlMock } from './__mocks__/remote-image-asset';

export default {
  title: 'Member/RemoteImageAsset',
  component: RemoteImageAsset,
};

const ArgsWrapper: Story<IRemoteImageAssetProps> = (args) => (
  <RemoteImageAsset {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  uri: imageUrlMock,
};
