// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import renderer from 'react-test-renderer';
import { SectionView } from './section-view';

describe('SectionView', () => {
  it("renders with 'region' accessibility role", () => {
    const testRenderer = renderer.create(
      <SectionView>
        <Text />
      </SectionView>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.accessibilityRole).toEqual('region');
  });

  it('renders with specified content', () => {
    const content = <Text />;
    const testRenderer = renderer.create(<SectionView>{content}</SectionView>);

    const component = testRenderer.root.findByProps({
      accessibilityRole: 'region',
    });
    const contentComponent = component.props.children;
    expect(contentComponent).toEqual(content);
  });

  it('passes properties through to view component', () => {
    const style = { width: '100%' };

    const testRenderer = renderer.create(
      <SectionView style={style}>
        <Text />
      </SectionView>
    );

    const component = testRenderer.root.findByType(View);
    expect(component.props.style).toEqual(style);
  });
});
