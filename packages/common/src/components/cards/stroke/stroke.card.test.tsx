// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { CardContainer } from '../../containers/card/card.container';
import { StrokeCard } from './stroke.card';
import { strokeCardStyles } from './stroke.card.styles';

describe('StrokeCard', () => {
  it('renders as View container', () => {
    const contentMock = <>content</>;
    const customStyle: ViewStyle = {
      width: 20,
    };
    const isSingletonMock = true;
    const testIdMock = 'test-id';

    const testRenderer = renderer.create(
      <StrokeCard
        viewStyle={customStyle}
        isSingleton={isSingletonMock}
        testID={testIdMock}
      >
        {contentMock}
      </StrokeCard>
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(CardContainer);
    expect(container.props.isSingleton).toEqual(isSingletonMock);
    expect(container.props.style).toEqual([
      strokeCardStyles.viewStyle,
      customStyle,
    ]);
    expect(container.props.testID).toEqual(testIdMock);
    expect(container.props.children).toEqual(contentMock);
  });
});
