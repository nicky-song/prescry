// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ImageAsset } from '../../image-asset/image-asset';
import { ApplicationHeaderLogo } from './application-header-logo';
import { applicationHeaderLogoStyles } from './application-header-logo.styles';

jest.mock('../../image-asset/image-asset', () => ({
  ImageAsset: () => <div />,
}));

describe('ApplicationHeaderLogo', () => {
  it('renders image', () => {
    const testRenderer = renderer.create(<ApplicationHeaderLogo />);

    const image = testRenderer.root.children[0] as ReactTestInstance;

    expect(image.type).toEqual(ImageAsset);
    expect(image.props.resizeMode).toEqual('contain');
    expect(image.props.name).toEqual('headerMyPrescryptiveLogo');
    expect(image.props.style).toEqual(
      applicationHeaderLogoStyles.imageMyPrescryptiveStyle
    );
  });

  it('renders rebranded image if flag is set', () => {
    const testRenderer = renderer.create(<ApplicationHeaderLogo />);
    const image = testRenderer.root.children[0] as ReactTestInstance;

    expect(image.type).toEqual(ImageAsset);
    expect(image.props.resizeMode).toEqual('contain');
    expect(image.props.name).toEqual('headerMyPrescryptiveLogo');
    expect(image.props.style).toEqual(
      applicationHeaderLogoStyles.imageMyPrescryptiveStyle
    );
  });
});
