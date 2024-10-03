// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ImageStyle, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { ImageInstanceNames } from '../../../../theming/assets';
import { ImageAsset } from '../../../image-asset/image-asset';
import { ListItem } from '../../../primitives/list-item';
import { BaseText } from '../../../text/base-text/base-text';
import { IllustratedListItem } from './illustrated.list-item';
import { illustratedListItemStyles } from './illustrated.list-item.styles';

jest.mock('../../../image-asset/image-asset', () => ({
  ImageAsset: () => <div />,
}));

jest.mock('../../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

describe('IllustratedListItem', () => {
  it('renders as list item', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <IllustratedListItem
        imageName='couponLogo'
        imageStyle={{}}
        description='description'
        viewStyle={customViewStyle}
      />
    );

    const listItem = testRenderer.root.children[0] as ReactTestInstance;

    expect(listItem.type).toEqual(ListItem);
    expect(listItem.props.style).toEqual([
      illustratedListItemStyles.viewStyle,
      customViewStyle,
    ]);
    expect(getChildren(listItem).length).toEqual(2);
  });

  it('renders image', () => {
    const imageNameMock: ImageInstanceNames = 'couponLogo';
    const imageStyleMock: ImageStyle = { width: 64, height: 64 };

    const testRenderer = renderer.create(
      <IllustratedListItem
        imageName={imageNameMock}
        imageStyle={imageStyleMock}
        description='description'
      />
    );

    const listItem = testRenderer.root.findByType(ListItem);
    const image = getChildren(listItem)[0];

    expect(image.type).toEqual(ImageAsset);
    expect(image.props.name).toEqual(imageNameMock);
    expect(image.props.style).toEqual(imageStyleMock);
  });

  it('renders description', () => {
    const descriptionMock = 'description';
    const testRenderer = renderer.create(
      <IllustratedListItem
        imageName='couponLogo'
        imageStyle={{}}
        description={descriptionMock}
      />
    );

    const listItem = testRenderer.root.findByType(ListItem);
    const description = getChildren(listItem)[1];

    expect(description.type).toEqual(BaseText);
    expect(description.props.style).toEqual(
      illustratedListItemStyles.descriptionTextStyle
    );
    expect(description.props.children).toEqual(descriptionMock);
  });

  it('renders base text with skeleton prop', () => {
    const testRenderer = renderer.create(
      <IllustratedListItem
        imageName='couponLogo'
        imageStyle={{}}
        description='description'
        isSkeleton={true}
      />
    );

    const listItem = testRenderer.root.findByType(ListItem);
    const description = getChildren(listItem)[1];

    expect(description.type).toEqual(BaseText);
    expect(description.props.style).toEqual(
      illustratedListItemStyles.descriptionTextStyle
    );
    expect(description.props.isSkeleton).toEqual(true);
  });
});
