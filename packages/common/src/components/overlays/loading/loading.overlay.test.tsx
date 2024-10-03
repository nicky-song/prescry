// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { LoadingOverlay } from './loading.overlay';
import { loadingOverlayContent } from './loading.overlay.content';
import { loadingOverlayStyles } from './loading.overlay.styles';

describe('LoadingOverlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders in Modal', () => {
    const visibleMock = true;
    const testRenderer = renderer.create(
      <LoadingOverlay visible={visibleMock} />
    );

    const modal = testRenderer.root.children[0] as ReactTestInstance;

    expect(modal.type).toEqual(Modal);
    expect(modal.props.transparent).toEqual(true);
    expect(modal.props.visible).toEqual(visibleMock);
    expect(getChildren(modal).length).toEqual(1);
  });

  it('renders content container', () => {
    const testRenderer = renderer.create(<LoadingOverlay />);

    const modal = testRenderer.root.findByType(Modal);
    const contentContainer = getChildren(modal)[0];

    expect(contentContainer.type).toEqual(View);
    expect(contentContainer.props.testID).toEqual('overlay-content');
    expect(contentContainer.props.style).toEqual(
      loadingOverlayStyles.contentViewStyle
    );
    expect(getChildren(contentContainer).length).toEqual(2);
  });

  it.each([
    [false, false, false],
    [true, false, false],
    [true, true, true],
  ])(
    'renders message container (visible: %p, showMessage: %p)',
    (
      isVisibleMock: boolean,
      showMessageMock: boolean,
      isContainerExpected: boolean
    ) => {
      const testRenderer = renderer.create(
        <LoadingOverlay visible={isVisibleMock} showMessage={showMessageMock} />
      );

      const contentContainer = testRenderer.root.findByProps({
        testID: 'overlay-content',
      });
      const messageContainer = getChildren(contentContainer)[0];

      if (!isContainerExpected) {
        expect(messageContainer).toBeNull();
      } else {
        expect(messageContainer.type).toEqual(View);
        expect(messageContainer.props.testID).toEqual(
          'overlay-content-message'
        );
        expect(messageContainer.props.style).toEqual(
          loadingOverlayStyles.messageContainerViewStyle
        );
        expect(getChildren(messageContainer).length).toEqual(2);
      }
    }
  );

  it.each([
    [undefined, loadingOverlayContent.defaultMessage],
    ['custom message', 'custom message'],
  ])(
    'renders message (message: %p)',
    (messageMock: string | undefined, expectedMessage: string) => {
      const testRenderer = renderer.create(
        <LoadingOverlay
          showMessage={true}
          visible={true}
          message={messageMock}
        />
      );
      const messageContainer = testRenderer.root.findByProps({
        testID: 'overlay-content-message',
      });
      const message = getChildren(messageContainer)[0];

      expect(message.type).toEqual(BaseText);
      expect(message.props.style).toEqual(
        loadingOverlayStyles.messageTextStyle
      );
      expect(getChildren(message)[0]).toEqual(expectedMessage);
    }
  );

  it('renders "Do not refresh" message', () => {
    const testRenderer = renderer.create(
      <LoadingOverlay showMessage={true} visible={true} />
    );
    const messageContainer = testRenderer.root.findByProps({
      testID: 'overlay-content-message',
    });
    const doNotRefreshMessage = getChildren(messageContainer)[1];

    expect(doNotRefreshMessage.type).toEqual(BaseText);
    expect(doNotRefreshMessage.props.style).toEqual(
      loadingOverlayStyles.doNotRefreshTextStyle
    );
    expect(getChildren(doNotRefreshMessage)[0]).toEqual(
      loadingOverlayContent.doNotRefreshMessage
    );
  });

  it('renders spinner', () => {
    const testRenderer = renderer.create(<LoadingOverlay />);

    const contentContainer = testRenderer.root.findByProps({
      testID: 'overlay-content',
    });
    const spinner = getChildren(contentContainer)[1];

    expect(spinner.type).toEqual(ActivityIndicator);
    expect(spinner.props.color).toEqual(
      loadingOverlayStyles.spinnerColorTextStyle.color
    );
    expect(spinner.props.size).toEqual('large');
  });
});
