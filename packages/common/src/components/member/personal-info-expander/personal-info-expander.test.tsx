// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import {
  PersonalInfoExpander,
  IPersonalInfoExpanderDataProps,
} from './personal-info-expander';
import { personalInfoExpanderContent } from './personal-info-expander.content';
import { personalInfoExpanderStyles } from './personal-info-expander.styles';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../../text/translated-base-text/translatable-base-text';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const mockPersonalInfoData: IPersonalInfoExpanderDataProps = {
  PersonalInfoExpanderData: {
    dateOfBirth: '2000-01-01',
    name: 'fakeFirstNAme fakeLastName',
  },
};

const dateOfBirthFormatted = '01/01/2000';

describe('PersonalInfoExpander', () => {
  it('should render with expected default props', () => {
    const customViewStyle: ViewStyle = {
      width: 1,
    };
    const testRenderer = renderer.create(
      <PersonalInfoExpander
        {...mockPersonalInfoData}
        viewStyle={customViewStyle}
      />
    );

    const view = testRenderer.root.findByType(View);
    const icon = testRenderer.root.findByType(FontAwesomeIcon);

    const title = testRenderer.root.findByProps({
      style: personalInfoExpanderStyles.headerViewStyle,
    });
    const textRenderer = renderer.create(title.props.children);
    const titleText = textRenderer.root.findByType(Text);

    expect(view.props.style).toEqual([
      personalInfoExpanderStyles.viewStyle,
      customViewStyle,
    ]);
    expect(icon.props.name).toEqual('chevron-down');
    expect(icon.props.solid).toEqual(true);
    expect(icon.props.style).toEqual(personalInfoExpanderStyles.iconTextStyle);
    expect(titleText.props.children).toEqual(
      personalInfoExpanderContent.headerText
    );
  });

  it('should render personal info when expanded', () => {
    const testRenderer = renderer.create(
      <PersonalInfoExpander {...mockPersonalInfoData} />
    );

    const iconContainer = testRenderer.root.findByProps({
      style: personalInfoExpanderStyles.iconContainerTextStyle,
    });
    iconContainer.props.onPress();

    const contentView = testRenderer.root.findByProps({
      style: personalInfoExpanderStyles.contentViewStyle,
    });

    const protectedBaseTexts =
      testRenderer.root.findAllByType(ProtectedBaseText);
    const translatableBaseTexts =
      testRenderer.root.findAllByType(TranslatableBaseText);

    expect(contentView).toBeDefined();

    const icon = iconContainer.props.children;
    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('chevron-up');
    expect(icon.props.solid).toEqual(true);
    expect(translatableBaseTexts[0].props.children).toEqual(
      personalInfoExpanderContent.name
    );
    expect(protectedBaseTexts[0].props.children).toEqual(
      mockPersonalInfoData.PersonalInfoExpanderData.name
    );
    expect(translatableBaseTexts[1].props.children).toEqual(
      personalInfoExpanderContent.dateOfBirth
    );
    expect(translatableBaseTexts[2].props.children).toEqual(
      dateOfBirthFormatted
    );
  });
});
