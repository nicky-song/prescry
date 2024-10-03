// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { BaseButton } from '../base/base.button';
import { HomeButton } from './home.button';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const uiContentMock: Partial<IGlobalContent> = {
  homeButton: 'home-button-mock',
};

describe('HomeButton', () => {
  it('renders as BaseButton', () => {
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });

    const onPressMock = jest.fn();
    const viewStyleMock: ViewStyle = {
      width: 1,
    };

    const testRenderer = renderer.create(
      <HomeButton onPress={onPressMock} viewStyle={viewStyleMock} />
    );

    const baseButton = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseButton.type).toEqual(BaseButton);
    expect(baseButton.props.onPress).toBe(onPressMock);
    expect(baseButton.props.viewStyle).toEqual(viewStyleMock);
    expect(baseButton.props.children).toEqual(uiContentMock.homeButton);
    expect(baseButton.props.isSkeleton).toBe(false);
  });
});
