// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { IconSize } from '../../../theming/icons';
import { CardContainer } from '../../containers/card/card.container';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { LineSeparator } from '../../member/line-separator/line-separator';
import { ExpandableCard } from './expandable.card';
import { expandableCardStyles } from './expandable.card.styles';
import { Heading } from '../../member/heading/heading';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;

jest.mock('../../member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('ExpandableCard', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValue([false, jest.fn()]);
  });

  it.each([
    [undefined, 'expandableCard'],
    ['test-id', 'test-id'],
  ])(
    'renders expandable card container',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const viewStyleMock: ViewStyle = {
        margin: Spacing.base,
      };
      const isSingletonMock = true;

      const testRenderer = renderer.create(
        <ExpandableCard
          viewStyle={viewStyleMock}
          collapsedContent=''
          collapsedTitle=''
          expandedContent=''
          expandedTitle=''
          isSingleton={isSingletonMock}
          testID={testIdMock}
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;
      expect(container.type).toEqual(CardContainer);
      expect(container.props.isSingleton).toEqual(isSingletonMock);
      expect(container.props.testID).toEqual(expectedTestId);
      expect(container.props.style).toEqual(viewStyleMock);
      expect(getChildren(container).length).toEqual(3);
    }
  );

  it.each([
    [1, 1],
    [undefined, 3],
  ])(
    'renders heading',
    (levelMock: number | undefined, expectedLevel: number) => {
      const translateTitleContentMock = true;

      useStateMock.mockReturnValue([false, jest.fn()]);
      const testRenderer = renderer.create(
        <ExpandableCard
          collapsedContent=''
          collapsedTitle=''
          expandedContent=''
          expandedTitle=''
          headingLevel={levelMock}
          translateTitleContent={translateTitleContentMock}
        />
      );
      const container = testRenderer.root.findByProps({
        testID: 'expandableCard',
      });

      const heading = getChildren(container)[0];

      expect(heading.type).toEqual(Heading);
      expect(getChildren(heading).length).toEqual(1);
      expect(heading.props.level).toEqual(expectedLevel);
      expect(heading.props.translateContent).toEqual(translateTitleContentMock);
    }
  );

  it('renders collapse/expand button', () => {
    useStateMock.mockReturnValue([false, jest.fn()]);
    const testRenderer = renderer.create(
      <ExpandableCard
        collapsedContent=''
        collapsedTitle=''
        expandedContent=''
        expandedTitle=''
      />
    );
    const container = testRenderer.root.findByProps({
      testID: 'expandableCard',
    });

    const heading = getChildren(container)[0];

    const touchableOpacity = getChildren(heading)[0];

    expect(getChildren(touchableOpacity).length).toEqual(2);
    expect(touchableOpacity.type).toEqual(TouchableOpacity);
    expect(touchableOpacity.props.accessibilityRole).toEqual('button');
    expect(touchableOpacity.props.onPress).toEqual(expect.any(Function));
    expect(touchableOpacity.props.style).toEqual(
      expandableCardStyles.headingContainerViewStyle
    );
  });

  it.each([
    [false, 'collapsed-children-mock'],
    [true, 'expanded-children-mock'],
  ])(
    'renders content  (initialStateMock: %p)',
    (initialStateMock: boolean, expectedContentChildren: string) => {
      const collapsedContentMock = <View>collapsed-children-mock</View>;

      const expandedContentMock = <View>expanded-children-mock</View>;

      useStateMock.mockReturnValue([initialStateMock, jest.fn()]);

      const testRenderer = renderer.create(
        <ExpandableCard
          collapsedContent={collapsedContentMock}
          collapsedTitle=''
          expandedContent={expandedContentMock}
          expandedTitle=''
        />
      );
      const container = testRenderer.root.findByProps({
        testID: 'expandableCard',
      });

      const cardContent = getChildren(container)[1];

      expect(cardContent.type).toEqual(View);
      expect(cardContent.props.children).toEqual(expectedContentChildren);
    }
  );

  it('renders line separator ', () => {
    const collapsedContentTitleMock = 'collapsed-content-title-mock';

    const testRenderer = renderer.create(
      <ExpandableCard
        initialState='collapsed'
        collapsedContent=''
        collapsedTitle={collapsedContentTitleMock}
        expandedContent=''
        expandedTitle=''
      />
    );
    const container = testRenderer.root.findByProps({
      testID: 'expandableCard',
    });

    const lineSeparator = getChildren(container)[2];

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      expandableCardStyles.lineSeparatorViewStyle
    );
  });

  it.each([
    [false, 'collapsed-title-mock', true],
    [true, 'expanded-title-mock', true],
    [true, 'collapsed-title-mock', false],
  ])(
    'renders title (initialStateMock: %p; expectedTitle: %p; expandedTitleDefined: %p)',
    (
      initialStateMock: boolean,
      expectedTitle: string,
      expandedTitleDefined: boolean
    ) => {
      const collapsedContentTitleMock = 'collapsed-title-mock';
      const expandedContentTitleMock = 'expanded-title-mock';
      const isSkeletonMock = true;

      useStateMock.mockReturnValue([initialStateMock, jest.fn()]);

      const testRenderer = renderer.create(
        <ExpandableCard
          collapsedContent=''
          collapsedTitle={collapsedContentTitleMock}
          expandedContent=''
          expandedTitle={
            expandedTitleDefined ? expandedContentTitleMock : undefined
          }
          isSkeleton={isSkeletonMock}
        />
      );
      const container = testRenderer.root.findByProps({
        testID: 'expandableCard',
      });

      const heading = getChildren(container)[0];

      const touchableOpacity = getChildren(heading)[0];

      const baseText = getChildren(touchableOpacity)[0];

      expect(baseText.type).toEqual(BaseText);
      expect(baseText.props.inheritStyle).toEqual(true);
      expect(baseText.props.isSkeleton).toEqual(isSkeletonMock);
      expect(baseText.props.skeletonWidth).toEqual('medium');
      expect(baseText.props.children).toEqual(expectedTitle);
    }
  );

  it.each([
    [false, 'chevron-down'],
    [true, 'chevron-up'],
  ])(
    'should renders expand/collapse icon is rendered (initialStateMock: %p; expectedIcon: %p)',
    (initialStateMock: boolean, expectedIcon: string) => {
      useStateMock.mockReturnValue([initialStateMock, jest.fn()]);
      const testRenderer = renderer.create(
        <ExpandableCard
          collapsedContent=''
          collapsedTitle=''
          expandedContent=''
          expandedTitle=''
        />
      );
      const container = testRenderer.root.findByProps({
        testID: 'expandableCard',
      });

      const heading = getChildren(container)[0];

      const touchableOpacity = getChildren(heading)[0];

      const fontAwesomeIcon = getChildren(touchableOpacity)[1];

      expect(fontAwesomeIcon.type).toEqual(FontAwesomeIcon);
      expect(fontAwesomeIcon.props.name).toEqual(expectedIcon);
      expect(fontAwesomeIcon.props.size).toEqual(IconSize.big);
      expect(fontAwesomeIcon.props.color).toEqual(PrimaryColor.darkBlue);
      expect(fontAwesomeIcon.props.style).toEqual(
        expandableCardStyles.expandIconViewStyle
      );
    }
  );

  it.each([
    [false, 'collapsed-content-children-mock'],
    [true, 'expanded-content-children-mock'],
  ])(
    'should renders content  (initialStateMock: %p)',
    (initialStateMock: boolean, expectedContentChildren: string) => {
      const collapsedContentChildrenMock = 'collapsed-content-children-mock';
      const expandedContentChildrenMock = 'expanded-content-children-mock';

      const collapsedContentMock = <View>{collapsedContentChildrenMock}</View>;

      const expandedContentMock = <View>{expandedContentChildrenMock}</View>;

      useStateMock.mockReturnValue([initialStateMock, jest.fn()]);

      const testRenderer = renderer.create(
        <ExpandableCard
          collapsedContent={collapsedContentMock}
          collapsedTitle=''
          expandedContent={expandedContentMock}
          expandedTitle=''
        />
      );
      const container = testRenderer.root.findByProps({
        testID: 'expandableCard',
      });

      const cardContent = getChildren(container)[1];

      expect(cardContent.type).toEqual(View);
      expect(cardContent.props.children).toEqual(expectedContentChildren);
    }
  );

  it('should render expected content when expandable button is pressed', () => {
    const collapsedContentTitleMock = 'collapsed-title-mock';
    const expandedContentTitleMock = 'expanded-title-mock';

    const collapsedContentChildrenMock = 'collapsed-content-children-mock';
    const expandedContentChildrenMock = 'expanded-content-children-mock';

    const collapsedContentMock = <View>{collapsedContentChildrenMock}</View>;

    const expandedContentMock = <View>{expandedContentChildrenMock}</View>;

    const testRenderer = renderer.create(
      <ExpandableCard
        initialState='expanded'
        collapsedContent={collapsedContentMock}
        collapsedTitle={collapsedContentTitleMock}
        expandedContent={expandedContentMock}
        expandedTitle={expandedContentTitleMock}
      />
    );
    const container = testRenderer.root.findByProps({
      testID: 'expandableCard',
    });

    const heading = getChildren(container)[0];

    const touchableOpacity = getChildren(heading)[0];

    expect(touchableOpacity.props.style).toEqual(
      expandableCardStyles.headingContainerViewStyle
    );
    expect(touchableOpacity.props.onPress).toEqual(expect.any(Function));

    const onPress = touchableOpacity.props.onPress;

    onPress();

    expect(useStateMock).toHaveBeenCalledWith(true);
  });

  it('should call setShowFullCard when expandable button is pressed', () => {
    const collapsedContentTitleMock = 'collapsed-title-mock';
    const expandedContentTitleMock = 'expanded-title-mock';

    useStateMock.mockReturnValue([true, jest.fn()]);

    const testRenderer = renderer.create(
      <ExpandableCard
        initialState='expanded'
        collapsedContent=''
        collapsedTitle={collapsedContentTitleMock}
        expandedContent=''
        expandedTitle={expandedContentTitleMock}
      />
    );
    const container = testRenderer.root.findByProps({
      testID: 'expandableCard',
    });

    const heading = getChildren(container)[0];

    const touchableOpacity = getChildren(heading)[0];

    expect(touchableOpacity.props.onPress).toEqual(expect.any(Function));

    const onPress = touchableOpacity.props.onPress;

    onPress();

    expect(useStateMock).toHaveBeenCalledWith(true);
  });

  it('should render expected content when content prop is a function', () => {
    const collapsedContentTitleMock = 'collapsed-title-mock';
    const expandedContentTitleMock = 'expanded-title-mock';

    useStateMock.mockReturnValue([false, jest.fn()]);

    const functionContentChildrenMock = 'functionContentViewMock';

    const collapsedContentFunctionMock = (): ReactNode => (
      <View>{functionContentChildrenMock}</View>
    );

    const testRenderer = renderer.create(
      <ExpandableCard
        initialState='collapsed'
        collapsedContent={collapsedContentFunctionMock}
        collapsedTitle={collapsedContentTitleMock}
        expandedContent=''
        expandedTitle={expandedContentTitleMock}
      />
    );
    const container = testRenderer.root.findByProps({
      testID: 'expandableCard',
    });

    const cardContent = getChildren(container)[1];

    expect(cardContent.type).toEqual(View);
    expect(cardContent.props.children).toEqual(functionContentChildrenMock);
  });

  it.each([[undefined], [false], [true]])(
    'renders bottom line (hideLine: %p)',
    (hideLineMock: boolean | undefined) => {
      const testRenderer = renderer.create(
        <ExpandableCard
          hideLine={hideLineMock}
          collapsedTitle=''
          expandedContent=''
        />
      );

      const container = testRenderer.root.findByProps({
        testID: 'expandableCard',
      });
      const line = getChildren(container)[2];

      if (hideLineMock) {
        expect(line).toBeNull();
      } else {
        expect(line.type).toEqual(LineSeparator);
        expect(line.props.viewStyle).toEqual(
          expandableCardStyles.lineSeparatorViewStyle
        );
      }
    }
  );
});
