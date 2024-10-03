// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { Heading } from '../../member/heading/heading';
import { ProtectedView } from '../protected-view/protected-view';
import { TranslatableView } from '../translated-view/translatable-view';
import { BodyContentContainer } from './body-content.container';
import { bodyContentContainerStyles } from './body-content.container.styles';

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

describe('BodyContentContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders as View', () => {
    const customViewStyle: ViewStyle = {
      width: 1,
    };
    const testIdMock = 'test-id';

    const testRenderer = renderer.create(
      <BodyContentContainer viewStyle={customViewStyle} testID={testIdMock}>
        <div />
      </BodyContentContainer>
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual([
      bodyContentContainerStyles.viewStyle,
      customViewStyle,
    ]);
    expect(view.props.testID).toEqual(testIdMock);

    expect(getChildren(view).length).toEqual(2);
  });

  it.each([
    [undefined, undefined],
    ['', undefined],
    ['', true],
    ['title', true],
  ])(
    'renders title %p isSkeleton %p',
    (titleMock: undefined | string, isSkeletonMock?: boolean) => {
      const testRenderer = renderer.create(
        <BodyContentContainer title={titleMock} isSkeleton={isSkeletonMock}>
          <div />
        </BodyContentContainer>
      );

      const container = testRenderer.root.findByType(View);
      const heading = getChildren(container)[0];

      if (titleMock || (titleMock === '' && isSkeletonMock)) {
        expect(heading.type).toEqual(Heading);
        expect(heading.props.textStyle).toEqual(
          bodyContentContainerStyles.titleViewStyle
        );
        expect(heading.props.children).toEqual(titleMock);
        
        if (isSkeletonMock) {
          expect(heading.props.isSkeleton).toEqual(true);
          expect(heading.props.skeletonWidth).toEqual('long');
        }
      }
      else {
        expect(heading).toBeNull();
      }
    }
  );

  it('renders title as null when undefined', () => {
    const testRenderer = renderer.create(
      <BodyContentContainer>
        <div />
      </BodyContentContainer>
    );

    const container = testRenderer.root.findByType(View);
    const heading = getChildren(container)[0];

    expect(heading).toBeNull();
  });

  it('renders title as Heading when string', () => {
    const titleMock = 'title-mock';
    const testRenderer = renderer.create(
      <BodyContentContainer title={titleMock}>
        <div />
      </BodyContentContainer>
    );

    const container = testRenderer.root.findByType(View);
    const heading = getChildren(container)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(
      bodyContentContainerStyles.titleViewStyle
    );
    expect(heading.props.children).toEqual(titleMock);
  });

  it('renders title as TranslatableView with prop as child when ReactNode', () => {
    const titleMock = <div />;
    const testRenderer = renderer.create(
      <BodyContentContainer title={titleMock}>
        <div />
      </BodyContentContainer>
    );

    const container = testRenderer.root.findByType(View);
    const heading = getChildren(container)[0];

    expect(heading.type).toEqual(TranslatableView);
    expect(heading.props.style).toEqual(
      bodyContentContainerStyles.titleViewStyle
    );
    expect(getChildren(heading).length).toEqual(1);
    expect(getChildren(heading)[0]).toEqual(titleMock);
  });

  it('renders title as ProtectedView with prop as child when ReactNode when translateTitle is false', () => {
    const titleMock = <div />;
    const testRenderer = renderer.create(
      <BodyContentContainer title={titleMock} translateTitle={false}>
        <div />
      </BodyContentContainer>
    );

    const container = testRenderer.root.findByType(View);
    const heading = getChildren(container)[0];

    expect(heading.type).toEqual(ProtectedView);
    expect(heading.props.style).toEqual(
      bodyContentContainerStyles.titleViewStyle
    );
    expect(getChildren(heading).length).toEqual(1);
    expect(getChildren(heading)[0]).toEqual(titleMock);
  });

  it('renders container child', () => {
    const ChildMock = () => <div />;

    const testRenderer = renderer.create(
      <BodyContentContainer>
        <ChildMock />
      </BodyContentContainer>
    );

    const container = testRenderer.root.findByType(View);
    const child = getChildren(container)[1];

    expect(child).toEqual(<ChildMock />);
  });
});
