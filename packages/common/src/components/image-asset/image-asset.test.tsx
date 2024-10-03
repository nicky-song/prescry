// Copyright 2021 Prescryptive Health, Inc.

import { Image, Platform } from 'react-native';
import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getResolvedImageSource } from '../../utils/assets.helper';
import { ImageAsset } from './image-asset';

jest.mock('react-native', () => ({
  Image: () => <div />,
  Platform: {
    select: jest.fn(),
  },
}));
const platformSelectMock = Platform.select as jest.Mock;

jest.mock('../../utils/assets.helper');
const getResolvedImageSourceMock = getResolvedImageSource as jest.Mock;

const platformResizeModeMock = { ios: 'cover', android: 'contain' };

describe('ImageAsset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as Image', () => {
    const testRenderer = renderer.create(<ImageAsset name='couponIcon' />);

    const image = testRenderer.root.children[0] as ReactTestInstance;

    expect(image.type).toEqual(Image);
  });

  it('determines source', () => {
    const imageSourceMock = 1;
    getResolvedImageSourceMock.mockReturnValue(imageSourceMock);

    const imageNameMock = 'couponLogo';
    const testRenderer = renderer.create(<ImageAsset name={imageNameMock} />);

    const image = testRenderer.root.findByType(Image);

    expect(image.props.source).toEqual(imageSourceMock);
    expect(getResolvedImageSourceMock).toHaveBeenCalledTimes(1);
    expect(getResolvedImageSourceMock).toHaveBeenNthCalledWith(
      1,
      imageNameMock
    );
  });

  it.each([[undefined], [platformResizeModeMock]])(
    'determines image resize mode (resizeMode: %p)',
    (resizeModeMock: object | undefined) => {
      const imageResizeModeMock = 'cover';
      platformSelectMock.mockReturnValue(imageResizeModeMock);

      const testRenderer = renderer.create(
        <ImageAsset name='couponLogo' platformResizeMode={resizeModeMock} />
      );

      const image = testRenderer.root.findByType(Image);

      if (!resizeModeMock) {
        expect(image.props.resizeMode).toEqual(undefined);
      } else {
        expect(platformSelectMock).toHaveBeenCalledWith(resizeModeMock);
        expect(image.props.resizeMode).toEqual(imageResizeModeMock);
      }
    }
  );
});
