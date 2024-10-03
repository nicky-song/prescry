// Copyright 2021 Prescryptive Health, Inc.

import React, { CSSProperties } from 'react';
import { Platform } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  IMediaQueryContext,
  MediaSize,
} from '../../../experiences/guest-experience/context-providers/media-query/media-query.context';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';
import { HeadingText } from '../../primitives/heading-text';
import { HeadingGradient } from './heading.gradient';
import {
  headingGradientStyles,
  headingWebSmallTextStyle,
  headingWebLargeTextStyle,
} from './heading.gradient.styles';

jest.mock(
  '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook'
);
const useMediaQueryContextMock = useMediaQueryContext as jest.Mock;

describe('HeadingGradient', () => {
  beforeEach(() => {
    useMediaQueryContextMock.mockReturnValue({});
  });

  it.each([
    ['small', headingWebSmallTextStyle],
    ['medium', headingWebLargeTextStyle],
    ['large', headingWebLargeTextStyle],
  ])(
    'renders as h1 for web (media size: %p)',
    (mediaSizeMock: string, expectedStyle: CSSProperties) => {
      const mediaQueryContextMock: Partial<IMediaQueryContext> = {
        mediaSize: mediaSizeMock as MediaSize,
      };
      useMediaQueryContextMock.mockReturnValue(mediaQueryContextMock);

      Platform.OS = 'web';
      const textMock = 'text';
      const testRenderer = renderer.create(
        <HeadingGradient>{textMock}</HeadingGradient>
      );

      const text = testRenderer.root.children[0] as ReactTestInstance;

      expect(text.type).toEqual('h1');
      expect(text.props.style).toEqual(expectedStyle);
      expect(text.props.children).toEqual(textMock);
    }
  );

  it('renders as HeadingText for mobile', () => {
    Platform.OS = 'ios';
    const textMock = 'text';
    const testRenderer = renderer.create(
      <HeadingGradient>{textMock}</HeadingGradient>
    );

    const text = testRenderer.root.children[0] as ReactTestInstance;

    expect(text.type).toEqual(HeadingText);
    expect(text.props.style).toEqual(headingGradientStyles.headingTextStyle);
    expect(text.props.children).toEqual(textMock);
  });
});
