// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import renderer from 'react-test-renderer';
import { HeaderView } from './header-view';

describe('HeaderView', () => {
  it("renders with 'banner' accessibility role", () => {
    const testRenderer = renderer.create(
      <HeaderView>
        <Text />
      </HeaderView>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.accessibilityRole).toEqual('banner');
  });

  it('renders with specified content', () => {
    const content = <Text />;
    const testRenderer = renderer.create(<HeaderView>{content}</HeaderView>);

    const component = testRenderer.root.findByProps({
      accessibilityRole: 'banner',
    });
    const contentComponent = component.props.children;
    expect(contentComponent).toEqual(content);
  });

  it('passes properties through to view component', () => {
    const style = { width: '100%' };

    const testRenderer = renderer.create(
      <HeaderView style={style}>
        <Text />
      </HeaderView>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.style).toEqual(style);
  });
});
