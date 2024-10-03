// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { ImageInstanceNames } from '../../../theming/assets';
import { ImageAsset } from '../../image-asset/image-asset';
import { BaseText } from '../../text/base-text/base-text';

import { BottomSpacing, EmptyStateMessage } from './empty-state.message';
import { emptyStateMessageStyles } from './empty-state.message.styles';

describe('EmptyStateMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render parent container', () => {
    const viewStyleMock = { backgroundColor: 'purple' };
    const imageName: ImageInstanceNames = 'emptyClaimsImage';
    const messageMock = 'messageMock';

    const testRenderer = renderer.create(
      <EmptyStateMessage
        imageName={imageName}
        message={messageMock}
        viewStyle={viewStyleMock}
        bottomSpacing='regular'
      />
    );
    const bottomSpacingTextStyleMock =
      emptyStateMessageStyles.bottomRegularTextStyle;

    const view = testRenderer.root.children[0] as ReactTestInstance;
    expect(view.type).toEqual(View);
    expect(getChildren(view).length).toEqual(2);
    expect(view.props.testID).toEqual('emptyStateMessage');
    expect(view.props.style).toEqual([
      emptyStateMessageStyles.containerViewStyle,
      bottomSpacingTextStyleMock,
      viewStyleMock,
    ]);
  });

  it('Render image element', () => {
    const imageName: ImageInstanceNames = 'emptyClaimsImage';
    const messageMock = 'messageMock';
    const testRenderer = renderer.create(
      <EmptyStateMessage imageName={imageName} message={messageMock} />
    );
    const view = testRenderer.root.children[0] as ReactTestInstance;
    const image = getChildren(view)[0];
    expect(image.type).toEqual(ImageAsset);
    expect(image.props.name).toEqual(imageName);
    expect(image.props.style).toEqual(emptyStateMessageStyles.imageStyle);
    expect(image.props.resizeMode).toEqual('contain');
  });

  it('Render base text', () => {
    const imageName: ImageInstanceNames = 'emptyClaimsImage';
    const messageMock = 'messageMock';
    const testRenderer = renderer.create(
      <EmptyStateMessage imageName={imageName} message={messageMock} />
    );
    const view = testRenderer.root.children[0] as ReactTestInstance;
    const baseText = getChildren(view)[1];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      emptyStateMessageStyles.messageTextStyle
    );
    expect(baseText.props.children).toEqual(messageMock);
  });

  it.each([['regular'], ['wide'], [undefined]])(
    'handles bottom spacing : %p',
    (bottomSpacingMock: string | undefined) => {
      const viewStyleMock = { backgroundColor: 'purple' };
      const imageName: ImageInstanceNames = 'emptyClaimsImage';
      const messageMock = 'messageMock';
      const bottomSpacing = bottomSpacingMock as BottomSpacing;
      const testRenderer = renderer.create(
        <EmptyStateMessage
          imageName={imageName}
          message={messageMock}
          bottomSpacing={bottomSpacing}
          viewStyle={viewStyleMock}
        />
      );
      const bottomSpacingTextStyle =
        bottomSpacing === 'wide'
          ? emptyStateMessageStyles.bottomWideTextStyle
          : emptyStateMessageStyles.bottomRegularTextStyle;
      const view = testRenderer.root.children[0] as ReactTestInstance;
      expect(view.type).toEqual(View);
      expect(view.props.style).toEqual([
        emptyStateMessageStyles.containerViewStyle,
        bottomSpacingTextStyle,
        viewStyleMock,
      ]);
    }
  );
});
