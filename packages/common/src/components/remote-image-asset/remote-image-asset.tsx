// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ReactElement, useState } from 'react';
import { ImageProps, Image } from 'react-native';

export interface IRemoteImageAssetProps
  extends Omit<ImageProps, 'source' | 'resizeMethod' | 'resizeMode'> {
  uri: string;
}

export interface IImageDimensions {
  width: number;
  height: number;
}

export const RemoteImageAsset = ({
  uri,
  style,
  ...props
}: IRemoteImageAssetProps): ReactElement => {
  const [dimensions, setDimensions] = useState<IImageDimensions>();
  const onImageSizeSuccess = (width: number, height: number) => {
    setDimensions({
      width,
      height,
    });
  };

  React.useEffect(() => {
    Image.getSize(uri, onImageSizeSuccess);
  }, [uri]);

  if (!dimensions) {
    return <></>;
  }
  const { width, height } = dimensions;

  return (
    <Image
      source={{ uri }}
      resizeMethod='scale'
      resizeMode='contain'
      style={[{ width, height }, style]}
      {...props}
    />
  );
};
