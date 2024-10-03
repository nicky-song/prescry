// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import {
  Image,
  ImageProps,
  ImageResizeMode,
  Platform,
  PlatformOSType,
} from 'react-native';
import { ImageInstanceNames } from '../../theming/assets';
import { getResolvedImageSource } from '../../utils/assets.helper';

export type PlatformResizeModeType = {
  [key in PlatformOSType | 'default']?: ImageResizeMode;
};

export interface IImageAssetProps extends Partial<ImageProps> {
  name: ImageInstanceNames;
  platformResizeMode?: PlatformResizeModeType;
}

export const getPlatformResizeMode = (
  platformResizeMode?: PlatformResizeModeType
) => (platformResizeMode ? Platform.select(platformResizeMode) : undefined);

export const ImageAsset: React.SFC<IImageAssetProps> = (
  props: IImageAssetProps
) => {
  const source = getResolvedImageSource(props.name);
  const resizeMode = getPlatformResizeMode(props.platformResizeMode);

  return <Image resizeMode={resizeMode} {...props} source={source} />;
};
