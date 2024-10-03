// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { HeadingText } from './heading-text';

describe('HeadingText', () => {
  it("renders with 'heading' accessibility role", () => {
    const testRenderer = renderer.create(
      <HeadingText>
        <Text />
      </HeadingText>
    );

    const component = testRenderer.root.findByType(Text);
    expect(component.props.accessibilityRole).toEqual('heading');
  });

  it('renders with default aria-level of 1', () => {
    const testRenderer = renderer.create(
      <HeadingText>
        <Text />
      </HeadingText>
    );

    const component = testRenderer.root.findByType(Text);
    expect(component.props['aria-level']).toEqual(1);
  });

  it('renders with default specified aria-level', () => {
    const testRenderer = renderer.create(
      <HeadingText level={3}>
        <Text />
      </HeadingText>
    );

    const component = testRenderer.root.findByType(Text);
    expect(component.props['aria-level']).toEqual(3);
  });

  it('renders with specified content', () => {
    const content = <Text />;
    const testRenderer = renderer.create(<HeadingText>{content}</HeadingText>);

    const component = testRenderer.root.findByProps({
      accessibilityRole: 'heading',
    });
    const contentComponent = component.props.children;
    expect(contentComponent).toEqual(content);
  });

  it('passes properties through to text component', () => {
    const style = { width: '100%' };

    const testRenderer = renderer.create(
      <HeadingText style={style}>
        <Text />
      </HeadingText>
    );

    const component = testRenderer.root.findByType(Text);
    expect(component.props.style).toEqual(style);
  });

  it("does not pass 'level' property through to text component", () => {
    const testRenderer = renderer.create(
      <HeadingText level={2}>
        <Text />
      </HeadingText>
    );

    const component = testRenderer.root.findByType(Text);
    expect(component.props.level).toBeUndefined();
  });
});
