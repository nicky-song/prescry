// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { ChevronCard } from './chevron.card';
import { chevronCardStyles as styles } from './chevron.card.styles';
import { IconSize } from '../../../theming/icons';
import { PrimaryColor } from '../../../theming/colors';
import { getChildren } from '../../../testing/test.helper';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const onPressMock = jest.fn();
const childrenMock = <View />;

describe('ChevronCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([[undefined], [{ backgroundColor: 'purple' }]])(
    'renders ChevronCard as TouchableOpacity with expected props (viewStyle: %s)',
    (viewStyle?: ViewStyle) => {
      const testRenderer = renderer.create(
        <ChevronCard
          onPress={onPressMock}
          children={childrenMock}
          viewStyle={viewStyle}
        />
      );
      const touchableOpacity = testRenderer.root
        .children[0] as ReactTestInstance;

      expect(touchableOpacity.type).toEqual(TouchableOpacity);
      expect(touchableOpacity.props.onPress).toEqual(onPressMock);
      expect(touchableOpacity.props.style).toEqual([
        styles.chevronCardViewStyle,
        viewStyle,
      ]);

      const touchableOpacityChildren = getChildren(touchableOpacity);

      expect(touchableOpacityChildren.length).toEqual(2);

      const children = touchableOpacityChildren[0];
      const fontAwesomeIcon = touchableOpacityChildren[1];

      expect(children.type).toEqual(View);
      expect(fontAwesomeIcon.type).toEqual(FontAwesomeIcon);
    }
  );

  it('renders children in ChevronCard', () => {
    const testRenderer = renderer.create(
      <ChevronCard onPress={onPressMock} children={childrenMock} />
    );
    const touchableOpacity = testRenderer.root.children[0] as ReactTestInstance;
    const touchableOpacityChildren = getChildren(touchableOpacity);
    const children = touchableOpacityChildren[0];

    expect(children).toEqual(childrenMock);
  });

  it('renders chevron as FontAwesomeIcon', () => {
    const testRenderer = renderer.create(
      <ChevronCard onPress={onPressMock} children={childrenMock} />
    );
    const touchableOpacity = testRenderer.root.children[0] as ReactTestInstance;
    const touchableOpacityChildren = getChildren(touchableOpacity);
    const fontAwesomeIcon = touchableOpacityChildren[1];

    expect(fontAwesomeIcon.type).toEqual(FontAwesomeIcon);
    expect(fontAwesomeIcon.props.name).toEqual('chevron-right');
    expect(fontAwesomeIcon.props.size).toEqual(IconSize.small);
    expect(fontAwesomeIcon.props.color).toEqual(PrimaryColor.darkBlue);
  });
});
