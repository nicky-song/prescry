// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { FooterContentContainer } from './footer-content.container';
import { footerContentContainerStyles } from './footer-content.container.styles';

describe('FooterContentContainer', () => {
  it.each([
    [undefined, 'FooterContentContainer'],
    ['test-id', 'test-id'],
  ])(
    'renders as View (testID: %p)',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const customViewStyle: ViewStyle = {
        width: 1,
      };
      const testRenderer = renderer.create(
        <FooterContentContainer viewStyle={customViewStyle} testID={testIdMock}>
          <div />
        </FooterContentContainer>
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      expect(view.type).toEqual(View);
      expect(view.props.style).toEqual([
        footerContentContainerStyles.viewStyle,
        customViewStyle,
      ]);
      expect(view.props.testID).toEqual(expectedTestId);

      expect(getChildren(view).length).toEqual(1);
    }
  );

  it('renders container child', () => {
    const ChildMock = () => <div />;

    const testRenderer = renderer.create(
      <FooterContentContainer>
        <ChildMock />
      </FooterContentContainer>
    );

    const container = testRenderer.root.findByType(View);
    const child = getChildren(container)[0];

    expect(child).toEqual(<ChildMock />);
  });
});
