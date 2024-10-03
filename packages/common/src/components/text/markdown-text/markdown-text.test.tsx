// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { MarkdownText } from './markdown-text';
import Markdown from 'react-native-markdown-display';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from './markdown-text.styles';
import { TextStyle } from 'react-native';
import { BaseText } from '../base-text/base-text';
import { getChildren } from '../../../testing/test.helper';
import { SkeletonWidth } from '../../../theming/fonts';

jest.mock('react-native-markdown-display', () => '');

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('MarkdownText', () => {
  it('renders in text container', () => {
    const customTextStyle: TextStyle = { color: 'red' };

    const testRenderer = renderer.create(
      <MarkdownText textStyle={customTextStyle}>
        <ChildMock />
      </MarkdownText>
    );

    const text = testRenderer.root.children[0] as ReactTestInstance;

    expect(text.type).toEqual(BaseText);
    expect(text.props.style).toEqual(customTextStyle);
    expect(getChildren(text).length).toEqual(1);
  });

  it.each([
    [undefined, 'long'],
    ['short', 'short'],
    ['long', 'long'],
  ])(
    'renders in text container as skeleton when isSkeleton is true (skeletonWidth: %p)',
    (skeletonWidthMock: undefined | string, expectedSkeletonWidth: string) => {
      const customTextStyle: TextStyle = { color: 'red' };

      const testRenderer = renderer.create(
        <MarkdownText
          textStyle={customTextStyle}
          isSkeleton={true}
          skeletonWidth={skeletonWidthMock as SkeletonWidth}
        >
          <ChildMock />
        </MarkdownText>
      );

      const text = testRenderer.root.children[0] as ReactTestInstance;

      expect(text.type).toEqual(BaseText);
      expect(text.props.isSkeleton).toEqual(true);
      expect(text.props.skeletonWidth).toEqual(expectedSkeletonWidth);
    }
  );

  const customMarkdownTextStyles: IMarkdownTextStyles = {
    heading1: { color: 'orange' },
  };

  it.each([
    [undefined, markdownTextStyles],
    [customMarkdownTextStyles, customMarkdownTextStyles],
  ])(
    'renders as Markdown in text container (markdownStyles: %p)',
    (
      markdownStylesMock: undefined | IMarkdownTextStyles,
      expectedStyles: IMarkdownTextStyles
    ) => {
      const testRenderer = renderer.create(
        <MarkdownText markdownTextStyle={markdownStylesMock}>
          <ChildMock />
        </MarkdownText>
      );

      const textContainer = testRenderer.root.findByType(BaseText);
      const markdown = getChildren(textContainer)[0];

      expect(markdown.type).toEqual(Markdown);
      expect(markdown.props.style).toEqual(expectedStyles);
      expect(markdown.props.children).toEqual(<ChildMock />);
    }
  );

  it('renders custom color', () => {
    const customColor = 'red';
    const testRenderer = renderer.create(
      <MarkdownText color={customColor}>
        <ChildMock />
      </MarkdownText>
    );

    const markdown = testRenderer.root.findByType(Markdown);

    const expectedStyles = {
      ...markdownTextStyles,
      paragraph: {
        ...markdownTextStyles.paragraph,
        color: customColor,
      },
    };
    expect(markdown.props.style).toEqual(expectedStyles);
  });
});
