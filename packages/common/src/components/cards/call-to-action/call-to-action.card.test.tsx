// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { SquareButton } from '../../buttons/square-button/square.button';
import { CardContainer } from '../../containers/card/card.container';
import { NavigationLink } from '../../links/navigation/navigation.link';
import { TagList } from '../../lists/tag/tag.list';
import { Heading } from '../../member/heading/heading';
import { LineSeparator } from '../../member/line-separator/line-separator';
import { IBaseTagProps } from '../../tags/base/base.tag';
import { ActionRank, CallToActionCard } from './call-to-action.card';
import { callToActionCardStyles } from './call-to-action.card.styles';

jest.mock('../../lists/tag/tag.list', () => ({
  TagList: () => <div />,
}));

jest.mock('../../member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../buttons/square-button/square.button', () => ({
  SquareButton: () => <div />,
}));

jest.mock('../../links/navigation/navigation.link', () => ({
  NavigationLink: () => <div />,
}));

describe('CallToActionCard', () => {
  it.each([
    [undefined, 'callToActionCard'],
    ['test-id', 'test-id'],
  ])(
    'renders in CardContainer with testID %p',
    (testIdMock: string | undefined, expectedTestId: string) => {
      const isSingletonMock = true;
      const viewStyleMock: ViewStyle = { width: 1 };

      const testRenderer = renderer.create(
        <CallToActionCard
          isSingleton={isSingletonMock}
          viewStyle={viewStyleMock}
          title=''
          actionLabel=''
          onActionPress={jest.fn()}
          testID={testIdMock}
        >
          children
        </CallToActionCard>
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      expect(container.type).toEqual(CardContainer);
      expect(container.props.isSingleton).toEqual(isSingletonMock);
      expect(container.props.style).toEqual(viewStyleMock);
      expect(container.props.testID).toEqual(expectedTestId);
      expect(getChildren(container).length).toEqual(5);
    }
  );

  it('renders no tags if no tag props specified', () => {
    const testRenderer = renderer.create(
      <CallToActionCard
        title=''
        actionLabel=''
        tags={undefined}
        onActionPress={jest.fn()}
      >
        children
      </CallToActionCard>
    );

    const container = testRenderer.root.findByProps({
      testID: 'callToActionCard',
    });
    const tagList = getChildren(container)[0];

    expect(tagList).toBeNull();
  });

  it('renders tags if tag props specified', () => {
    const tagsMock: IBaseTagProps[] = [
      {
        label: 'tag',
        iconName: 'star',
        iconSolid: false,
      },
    ];

    const testRenderer = renderer.create(
      <CallToActionCard
        title=''
        actionLabel=''
        tags={tagsMock}
        onActionPress={jest.fn()}
      >
        children
      </CallToActionCard>
    );

    const container = testRenderer.root.findByProps({
      testID: 'callToActionCard',
    });
    const tagList = getChildren(container)[0];

    expect(tagList.type).toEqual(TagList);
    expect(tagList.props.tags).toEqual(tagsMock);
    expect(tagList.props.viewStyle).toEqual(
      callToActionCardStyles.tagListViewStyle
    );
  });

  it.each([
    [undefined, 3],
    [1, 1],
    [2, 2],
    [3, 3],
  ])(
    'renders title with heading level %p',
    (levelMock: number | undefined, expectedLevel: number) => {
      const titleMock = 'title';
      const isSkeletonMock = true;

      const testRenderer = renderer.create(
        <CallToActionCard
          title={titleMock}
          headingLevel={levelMock}
          isSkeleton={isSkeletonMock}
          actionLabel=''
          onActionPress={jest.fn()}
        >
          children
        </CallToActionCard>
      );

      const container = testRenderer.root.findByProps({
        testID: 'callToActionCard',
      });
      const heading = getChildren(container)[1];

      expect(heading.type).toEqual(Heading);
      expect(heading.props.level).toEqual(expectedLevel);
      expect(heading.props.isSkeleton).toEqual(isSkeletonMock);
      expect(heading.props.textStyle).toEqual(
        callToActionCardStyles.headingTextStyle
      );
      expect(heading.props.children).toEqual(titleMock);
    }
  );

  it('renders card children', () => {
    const ChildMock = () => <div />;

    const testRenderer = renderer.create(
      <CallToActionCard title='' actionLabel='' onActionPress={jest.fn()}>
        <ChildMock />
      </CallToActionCard>
    );

    const container = testRenderer.root.findByProps({
      testID: 'callToActionCard',
    });
    const children = getChildren(container)[2];

    expect(children).toEqual(<ChildMock />);
  });

  it.each([
    [undefined, 'primary'],
    ['primary', 'primary'],
    ['secondary', 'secondary'],
  ])(
    'renders action with rank %p',
    (rankMock: string | undefined, expectedRank: string) => {
      const isSkeletonMock = true;
      const actionLabelMock = 'action-label';
      const onActionPressMock = jest.fn();

      const testRenderer = renderer.create(
        <CallToActionCard
          title=''
          actionLabel={actionLabelMock}
          isSkeleton={isSkeletonMock}
          actionRank={rankMock as ActionRank}
          onActionPress={onActionPressMock}
        >
          children
        </CallToActionCard>
      );

      const container = testRenderer.root.findByProps({
        testID: 'callToActionCard',
      });
      const action = getChildren(container)[3];

      if (rankMock !== 'secondary') {
        expect(action.type).toEqual(SquareButton);
        expect(action.props.onPress).toEqual(onActionPressMock);
        expect(action.props.rank).toEqual(expectedRank);
        expect(action.props.isSkeleton).toEqual(isSkeletonMock);
        expect(action.props.viewStyle).toEqual(
          callToActionCardStyles.buttonViewStyle
        );
        expect(action.props.children).toEqual(actionLabelMock);
      } else {
        expect(action.type).toEqual(NavigationLink);
        expect(action.props.onPress).toEqual(onActionPressMock);
        expect(action.props.label).toEqual(actionLabelMock);
        expect(action.props.isSkeleton).toEqual(isSkeletonMock);
        expect(action.props.linkColor).toEqual(
          callToActionCardStyles.linkColorTextStyle.color
        );
        expect(action.props.viewStyle).toEqual(
          callToActionCardStyles.linkViewStyle
        );
      }
    }
  );

  it.each([[undefined], [false], [true]])(
    'renders bottom line (hideLine: %p)',
    (hideLineMock: boolean | undefined) => {
      const testRenderer = renderer.create(
        <CallToActionCard
          hideLine={hideLineMock}
          title=''
          actionLabel=''
          onActionPress={jest.fn()}
        >
          children
        </CallToActionCard>
      );

      const container = testRenderer.root.findByProps({
        testID: 'callToActionCard',
      });
      const line = getChildren(container)[4];

      if (hideLineMock) {
        expect(line).toBeNull();
      } else {
        expect(line.type).toEqual(LineSeparator);
        expect(line.props.viewStyle).toEqual(
          callToActionCardStyles.separatorViewStyle
        );
      }
    }
  );
});
