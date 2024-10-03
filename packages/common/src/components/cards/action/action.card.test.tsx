// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View, ViewStyle } from 'react-native';
import { getChildren } from '../../../testing/test.helper';
import { StrokeCard } from '../stroke/stroke.card';
import { ActionCard, IActionCardButtonProps } from './action.card';
import { actionCardStyles } from './action.card.styles';
import { Heading } from '../../member/heading/heading';
import { BaseButton } from '../../buttons/base/base.button';
import { ImageInstanceNames } from '../../../theming/assets';
import { ImageAsset } from '../../image-asset/image-asset';
import { MarkdownText } from '../../text/markdown-text/markdown-text';

jest.mock('../../image-asset/image-asset', () => ({
  ImageAsset: () => <div />,
}));

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: () => <div />,
}));

jest.mock('../../member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

describe('ActionCard', () => {
  it('renders as stroke card', () => {
    const customStyle: ViewStyle = { width: 1 };
    const isSingletonMock = true;

    const testRenderer = renderer.create(
      <ActionCard
        title='title'
        subTitle='sub-title'
        viewStyle={customStyle}
        isSingleton={isSingletonMock}
      />
    );

    const card = testRenderer.root.children[0] as ReactTestInstance;

    expect(card.type).toEqual(StrokeCard);
    expect(card.props.viewStyle).toEqual(customStyle);
    expect(card.props.isSingleton).toEqual(isSingletonMock);
    expect(getChildren(card).length).toEqual(1);
  });

  it('renders content container', () => {
    const testRenderer = renderer.create(
      <ActionCard title='title' subTitle='sub-title' />
    );

    const card = testRenderer.root.findByType(StrokeCard);
    const contentContainer = getChildren(card)[0];

    expect(contentContainer.type).toEqual(View);
    expect(contentContainer.props.style).toEqual(
      actionCardStyles.contentContainerViewStyle
    );
    expect(getChildren(contentContainer).length).toEqual(4);
  });

  it('renders null for image when image prop not specified', () => {
    const testRenderer = renderer.create(
      <ActionCard title='title' subTitle='sub-title' />
    );

    const card = testRenderer.root.findByType(StrokeCard);
    const contentContainer = getChildren(card)[0];
    const image = getChildren(contentContainer)[0];

    expect(image).toBeNull();
  });

  it('renders image when image prop specified', () => {
    const imageNameMock: ImageInstanceNames = 'alertCircle';

    const testRenderer = renderer.create(
      <ActionCard
        title='title'
        subTitle='sub-title'
        imageName={imageNameMock}
      />
    );

    const card = testRenderer.root.findByType(StrokeCard);
    const contentContainer = getChildren(card)[0];
    const image = getChildren(contentContainer)[0];

    expect(image.type).toEqual(ImageAsset);
    expect(image.props.name).toEqual(imageNameMock);
    expect(image.props.resizeMode).toEqual('contain');
    expect(image.props.style).toEqual(actionCardStyles.imageStyle);
  });

  it.each([
    [undefined, 3],
    [1, 1],
    [2, 2],
    [3, 3],
  ])(
    'renders title (heading level: %p)',
    (headingLeavelMock: number | undefined, expectedHeadingLevel: number) => {
      const titleMock = 'title';

      const testRenderer = renderer.create(
        <ActionCard
          headingLevel={headingLeavelMock}
          title={titleMock}
          subTitle='sub-title'
        />
      );

      const card = testRenderer.root.findByType(StrokeCard);
      const contentContainer = getChildren(card)[0];
      const title = getChildren(contentContainer)[1];

      expect(title.type).toEqual(Heading);
      expect(title.props.level).toEqual(expectedHeadingLevel);

      const children = getChildren(title);

      expect(children.length).toEqual(1);
      expect(children[0]).toEqual(titleMock);
    }
  );

  it('renders sub-title', () => {
    const subTitleMock = 'sub-title';

    const testRenderer = renderer.create(
      <ActionCard title='title' subTitle={subTitleMock} />
    );

    const card = testRenderer.root.findByType(StrokeCard);
    const contentContainer = getChildren(card)[0];
    const subTitle = getChildren(contentContainer)[2];

    expect(subTitle.type).toEqual(MarkdownText);
    expect(subTitle.props.textStyle).toEqual(
      actionCardStyles.subTitleTextStyle
    );

    const children = getChildren(subTitle);

    expect(children.length).toEqual(1);
    expect(children[0]).toEqual(subTitleMock);
  });

  it('renders null for button when no button prop specified', () => {
    const testRenderer = renderer.create(
      <ActionCard title='title' subTitle='sub-title' />
    );

    const card = testRenderer.root.findByType(StrokeCard);
    const contentContainer = getChildren(card)[0];
    const button = getChildren(contentContainer)[3];

    expect(button).toBeNull();
  });

  it('renders button when button prop specified', () => {
    const onPressMock = jest.fn();
    const buttonMock: IActionCardButtonProps = {
      label: 'label',
      onPress: onPressMock,
    };
    const testIDMock = 'testIDMock';

    const testRenderer = renderer.create(
      <ActionCard
        title='title'
        subTitle='sub-title'
        button={buttonMock}
        testID={testIDMock}
      />
    );

    const card = testRenderer.root.findByType(StrokeCard);
    const contentContainer = getChildren(card)[0];
    const button = getChildren(contentContainer)[3];

    expect(button.type).toEqual(BaseButton);
    expect(button.props.size).toEqual('medium');
    expect(button.props.onPress).toEqual(onPressMock);
    expect(button.props.viewStyle).toEqual(actionCardStyles.buttonViewStyle);
    expect(button.props.testID).toEqual(testIDMock);

    const children = getChildren(button);

    expect(children.length).toEqual(1);
    expect(children[0]).toEqual(buttonMock.label);
  });

  it('renders skeletons when isSkeleton is true', () => {
    const onPressMock = jest.fn();
    const buttonMock: IActionCardButtonProps = {
      label: 'label',
      onPress: onPressMock,
    };
    const testIDMock = 'testIDMock';

    const testRenderer = renderer.create(
      <ActionCard
        title='title'
        subTitle='sub-title'
        button={buttonMock}
        testID={testIDMock}
        isSkeleton={true}
      />
    );

    const card = testRenderer.root.findByType(StrokeCard);
    const contentContainer = getChildren(card)[0];
    const button = getChildren(contentContainer)[3];

    expect(button.type).toEqual(BaseButton);
    expect(button.props.isSkeleton).toEqual(true);
    expect(button.props.skeletonWidth).toEqual('medium');

    const subTitle = getChildren(contentContainer)[2];

    expect(subTitle.type).toEqual(MarkdownText);
    expect(subTitle.props.isSkeleton).toEqual(true);

    const title = getChildren(contentContainer)[1];

    expect(title.type).toEqual(Heading);
    expect(title.props.isSkeleton).toEqual(true);
    expect(title.props.skeletonWidth).toEqual('medium');
  });
});
