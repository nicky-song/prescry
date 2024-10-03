// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { BaseText } from '../../text/base-text/base-text';
import { PinFeatureWelcomeScreenContainer } from './pin-feature-welcome-screen-container';
import { pinFeatureWelcomeScreenContainerStyles } from './pin-feature-welcome-screen-container.styles';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const uiContentMock: Partial<ISignInContent> = {
  containerHeaderText: 'container-header-text-mock',
  pinWelcomeInfoText1: 'pin-welcome-info-text-1-mock',
  pinWelcomeInfoText2: 'pin-welcome-info-text-2-mock',
};

const { containerViewStyle, containerHeaderTextStyle, containerInfoTextStyle } =
  pinFeatureWelcomeScreenContainerStyles;

describe('PinFeatureWelcomeScreenContainer', () => {
  beforeEach(() => {
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('renders container view', () => {
    const pinFeatureWelcomeScreenContainer = renderer.create(
      <PinFeatureWelcomeScreenContainer />
    );

    const view = pinFeatureWelcomeScreenContainer.root
      .children[0] as ReactTestInstance;

    expect(view.type).toBe(View);
    expect(view.props.style).toBe(containerViewStyle);
    expect(view.props.testID).toBe('pinFeatureWelcomeScreen');
  });

  it('renders 3 base text with expected props', () => {
    const pinFeatureWelcomeScreenContainer = renderer.create(
      <PinFeatureWelcomeScreenContainer />
    );

    const textBoxes =
      pinFeatureWelcomeScreenContainer.root.findAllByType(BaseText);
    expect(textBoxes.length).toBe(3);
    expect(textBoxes[0].props.children).toBe(uiContentMock.containerHeaderText);
    expect(textBoxes[0].props.style).toBe(containerHeaderTextStyle);
    expect(textBoxes[0].props.weight).toBe('medium');
    expect(textBoxes[1].props.children).toBe(uiContentMock.pinWelcomeInfoText1);
    expect(textBoxes[1].props.style).toBe(containerInfoTextStyle);
    expect(textBoxes[1].props.weight).toBe('medium');
    expect(textBoxes[2].props.children).toBe(uiContentMock.pinWelcomeInfoText2);
    expect(textBoxes[2].props.style).toBe(containerInfoTextStyle);
    expect(textBoxes[1].props.weight).toBe('medium');
  });

  it('renders skeletons', () => {
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: true,
    });

    const pinFeatureWelcomeScreenContainer = renderer.create(
      <PinFeatureWelcomeScreenContainer />
    );

    const textBoxes =
      pinFeatureWelcomeScreenContainer.root.findAllByType(BaseText);
    expect(textBoxes.length).toBe(3);
    expect(textBoxes[0].props.isSkeleton).toBe(true);
    expect(textBoxes[0].props.skeletonWidth).toBe('medium');
    expect(textBoxes[1].props.isSkeleton).toBe(true);
    expect(textBoxes[1].props.skeletonWidth).toBe('medium');
    expect(textBoxes[2].props.isSkeleton).toBe(true);
    expect(textBoxes[2].props.skeletonWidth).toBe('medium');
  });
});
