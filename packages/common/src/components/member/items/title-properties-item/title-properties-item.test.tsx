// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { titlePropertiesItemStyle as styles } from './title-properties-item.styles';
import { TitlePropertiesItem } from './title-properties-item';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../../../text/translated-base-text/translatable-base-text';

jest.mock('../../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('TitlePropertiesItem', () => {
  it('renders clickable item in TouchableOpacity with expected properties', () => {
    const mockedTestID = 'mockTestId';
    const viewStyle: ViewStyle = {
      backgroundColor: 'red',
    };

    const testRenderer = renderer.create(
      <TitlePropertiesItem style={viewStyle} testID={mockedTestID} />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

    expect(touchableOpacity.props.style).toEqual([
      styles.cardViewStyle,
      viewStyle,
    ]);
    expect(touchableOpacity.props.children.length).toEqual(2);
    expect(touchableOpacity.props.onPress).toBeDefined();
    expect(touchableOpacity.props.onPress.name).toEqual('onTouchablePress');
    expect(touchableOpacity.props.testID).toEqual(`${mockedTestID}`);
  });

  it('renders icon with expected properties', () => {
    const testRenderer = renderer.create(<TitlePropertiesItem testID='' />);
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

    const iconContainer = touchableOpacity.props.children[1];
    expect(iconContainer.type).toEqual(View);
    expect(iconContainer.props.style).toEqual(styles.iconContainerViewStyle);

    const icon = iconContainer.props.children;

    const iconImage = icon.props.children;
    expect(iconImage.type).toEqual(FontAwesomeIcon);
    expect(iconImage.props.name).toEqual('chevron-right');
    expect(iconImage.props.style).toEqual(styles.iconStyle);
  });

  it('renders clickable item Title in Text with expected properties', () => {
    const title = 'Some Item';

    const testRenderer = renderer.create(
      <TitlePropertiesItem testID='' title={title} />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textComponents = touchableOpacity.findAllByType(ProtectedBaseText);
    const titleComponent = textComponents[0];

    expect(titleComponent.props.style).toEqual(styles.titleTextStyle);
    expect(titleComponent.props.children).toEqual(title);
  });

  it('renders list of properties with Label and Content with expected properties', () => {
    const mockProperties = [
      {
        label: 'Label 1',
        content: 'THIS CONTENT UPPERCASE',
        translateContent: true,
      },
      {
        label: 'Label 2',
        content: 'THIS CONTENT UPPERCASE',
        translateContent: true,
      },
      {
        label: 'Label 3',
        content: 'THIS CONTENT UPPERCASE',
        translateContent: false,
      },
    ];

    const styleMock = {
      labelContentViewStyle: { flexDirection: 'row' },
      labelTextStyle: { flex: 1 },
      contentTextStyle: { flex: 3 },
    };

    const testRenderer = renderer.create(
      <TitlePropertiesItem testID='' properties={mockProperties} />
    );

    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    const textContainer = touchableOpacity.props.children[0];
    const propertyList = textContainer.props.children[1];

    expect(propertyList.length).toEqual(3);

    propertyList.forEach((property: ReactTestInstance, index: number) => {
      expect(property.props.style.flexDirection).toEqual(
        styleMock.labelContentViewStyle.flexDirection
      );
      expect(property.props.children[0].type).toEqual(Text);
      expect(property.props.children[0].props.style.flex).toEqual(
        styleMock.labelTextStyle.flex
      );
      expect(property.props.children[0].props.children).toEqual(
        mockProperties[index].label
      );
      if (mockProperties[index].translateContent) {
        expect(property.props.children[1].type).toEqual(TranslatableBaseText);
      } else {
        expect(property.props.children[1].type).toEqual(ProtectedBaseText);
      }
      expect(property.props.children[1].props.style.flex).toEqual(
        styleMock.contentTextStyle.flex
      );
      expect(property.props.children[1].props.children).toEqual(
        mockProperties[index].content
      );
    });
  });
});
