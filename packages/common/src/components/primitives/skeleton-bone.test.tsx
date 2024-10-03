// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { SkeletonBone } from './skeleton-bone';
import SkeletonContent from 'react-native-skeleton-content';
import { GrayScaleColor } from '../../theming/colors';

jest.mock('react-native-skeleton-content', () => () => <div />);

describe('SkeletonBone', () => {
  it.each([
    [undefined, undefined, GrayScaleColor.lightGray, GrayScaleColor.white],
    ['#37245C', '#ECE6FA', '#37245C', '#ECE6FA'],
  ])(
    'renders as SkeletonContent with expected props (boneColor: %p; highlightColor: %p;)',
    (
      boneColorMock: string | undefined,
      highlightColorMock: string | undefined,
      expectedBoneColor: string,
      expectedHighlightColor: string
    ) => {
      const containerViewStyleMock: ViewStyle = {
        backgroundColor: 'pink',
      };

      const layoutViewStyleListMock = [
        {
          backgroundColor: 'blue',
        } as ViewStyle,
      ];

      const testRenderer = renderer.create(
        <SkeletonBone
          containerViewStyle={containerViewStyleMock}
          layoutViewStyleList={layoutViewStyleListMock}
          boneColor={boneColorMock}
          highlightColor={highlightColorMock}
        />
      );

      const skeletonContent = testRenderer.root.findByType(SkeletonContent);

      const {
        containerStyle,
        boneColor,
        highlightColor,
        animationType,
        isLoading,
        layout,
      } = skeletonContent.props;

      expect(containerStyle).toEqual(containerViewStyleMock);
      expect(boneColor).toEqual(expectedBoneColor);
      expect(highlightColor).toEqual(expectedHighlightColor);
      expect(animationType).toEqual('shiver');
      expect(isLoading).toEqual(true);
      expect(layout).toEqual(layoutViewStyleListMock);
    }
  );
});
