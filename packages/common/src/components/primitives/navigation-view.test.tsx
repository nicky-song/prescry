// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import renderer from 'react-test-renderer';
import { NavigationView } from './navigation-view';

describe('NavigationView', () => {
  it("renders with 'navigation' accessibility role", () => {
    const testRenderer = renderer.create(
      <NavigationView>
        <Text />
      </NavigationView>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.accessibilityRole).toEqual('navigation');
  });

  it('renders with specified content', () => {
    const content = <Text />;
    const testRenderer = renderer.create(
      <NavigationView>{content}</NavigationView>
    );

    const component = testRenderer.root.findByProps({
      accessibilityRole: 'navigation',
    });
    const contentComponent = component.props.children;
    expect(contentComponent).toEqual(content);
  });

  it('passes properties through to view component', () => {
    const style = { width: '100%' };

    const testRenderer = renderer.create(
      <NavigationView style={style}>
        <Text />
      </NavigationView>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.style).toEqual(style);
  });
});
