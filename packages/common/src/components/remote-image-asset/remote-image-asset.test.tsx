// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { Image } from 'react-native';
import renderer, { ReactTestInstance, act } from 'react-test-renderer';
import { IImageDimensions, RemoteImageAsset } from './remote-image-asset';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;

jest.mock('react-native', () => ({
  Image: () => <div />,
}));

Image.getSize = jest.fn();

const getSizeMock = Image.getSize as jest.Mock;

interface IStateCalls {
  dimensions: [IImageDimensions | undefined, jest.Mock];
}

const imgUriMock = 'img-uri-mock';

const imageSizeMock = { width: 139, height: 24 };

const setDimensionsMock = jest.fn();

function stateReset({
  dimensions = [imageSizeMock, setDimensionsMock],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(dimensions);
}

describe('RemoteImageAsset', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    stateReset({});
  });

  it('renders as Image with expected props', () => {
    let testRenderer;
    act(() => {
      testRenderer = renderer.create(<RemoteImageAsset uri={imgUriMock} />);
    });

    if (!testRenderer) {
      fail('renderer not defined');
    }
    const image = (testRenderer as renderer.ReactTestRenderer)?.root
      ?.children[0] as ReactTestInstance;

    const expectedDimensions = { height: 24, width: 139 };

    expect(getSizeMock).toHaveBeenCalledTimes(1);
    expect(getSizeMock).toHaveBeenCalledWith(imgUriMock, expect.any(Function));

    const onSuccess = getSizeMock.mock.calls[0][1];
    onSuccess(imageSizeMock.width, imageSizeMock.height);

    expect(setDimensionsMock).toHaveBeenCalledWith(expectedDimensions);

    expect(image.type).toEqual(Image);
    expect(image.props.source).toEqual({ uri: imgUriMock });
    expect(image.props.resizeMethod).toEqual('scale');
    expect(image.props.resizeMode).toEqual('contain');
    expect(image.props.style).toEqual([imageSizeMock, undefined]);
  });

  it('renders return empty component when dimensions is not defined', () => {
    stateReset({
      dimensions: [undefined, jest.fn()],
    });

    Image.getSize = jest.fn().mockReturnValue(undefined);

    const testRenderer = renderer.create(
      <RemoteImageAsset uri={'invalid-image-url-mock'} />
    );

    const image = testRenderer.root.children[0] as ReactTestInstance;

    expect(getSizeMock).not.toHaveBeenCalled();

    expect(image).toEqual(undefined);
  });
});
