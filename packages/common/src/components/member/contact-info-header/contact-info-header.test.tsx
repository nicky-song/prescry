// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View, TextStyle, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import {
  ContactInfoHeader,
  IContactInfoHeaderActionProps,
  IContactInfoHeaderProps,
  contactInfoHeaderStyles,
  IContactInfoHeaderStyles,
} from './contact-info-header';
import { FontSize, GreyScale, PurpleScale } from '../../../theming/theme';
import { Spacing } from '../../../theming/spacing';
import { IconButton } from '../../buttons/icon/icon.button';
import { BaseText } from '../../text/base-text/base-text';
import { IconSize } from '../../../theming/icons';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

jest.mock('../../buttons/icon/icon.button', () => ({
  IconButton: () => <div />,
}));

const mockNavigateToEditMemberProfileScreen = jest.fn();
const contactInfoHeaderProps: IContactInfoHeaderProps = {
  isPrimary: true,
  name: 'Thomas Young',
};
const contactInfoHeaderActionProps: IContactInfoHeaderActionProps = {
  navigateToEditMemberProfileScreen: mockNavigateToEditMemberProfileScreen,
};

describe('ContactInfoHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with defaults', () => {
    const testRenderer = renderer.create(
      <ContactInfoHeader
        {...contactInfoHeaderProps}
        {...contactInfoHeaderActionProps}
      />
    );
    const view = testRenderer.root.findByType(View);
    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(
      contactInfoHeaderStyles.contactInfoHeaderViewStyle
    );

    const iconButton = view.props.children[1];
    expect(iconButton.type).toEqual(IconButton);
    expect(iconButton.props.iconName).toEqual('pen');
    expect(iconButton.props.onPress).toEqual(expect.any(Function));
    expect(iconButton.props.accessibilityLabel).toEqual('edit');
    expect(iconButton.props.viewStyle).toEqual(
      contactInfoHeaderStyles.editButtonViewStyle
    );
    expect(iconButton.props.iconTextStyle).toEqual(
      contactInfoHeaderStyles.editButtonIconTextStyle
    );
    expect(iconButton.props.iconSolid).toEqual(true);

    const protectedBaseText = view.props.children[0].props.children[0];
    expect(protectedBaseText.type).toEqual(ProtectedBaseText);
    expect(protectedBaseText.props.children).toEqual(
      contactInfoHeaderProps.name
    );
    expect(protectedBaseText.props.style).toEqual(
      contactInfoHeaderStyles.titleTextStyle
    );
    const baseText = view.props.children[0].props.children[1];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.children).toEqual('(Primary)');
    expect(baseText.props.style).toEqual(
      contactInfoHeaderStyles.primaryTextStyle
    );
  });

  it('renders correctly with isPrimary as false', () => {
    const testRenderer = renderer.create(
      <ContactInfoHeader
        {...contactInfoHeaderProps}
        {...contactInfoHeaderActionProps}
        isPrimary={false}
      />
    );
    const view = testRenderer.root.findByType(View);
    const protectedBaseText = view.props.children[0].props.children[0];
    expect(protectedBaseText.type).toEqual(ProtectedBaseText);
    expect(protectedBaseText.props.children).toEqual(
      contactInfoHeaderProps.name
    );
    const baseText = view.props.children[0].props.children[1];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.children).toEqual('');
  });

  it('should call onClickEditButton on click of editButton', () => {
    const header = renderer.create(
      <ContactInfoHeader
        {...contactInfoHeaderProps}
        {...contactInfoHeaderActionProps}
      />
    );
    header.root.findByType(IconButton).props.onPress();
    expect(
      contactInfoHeaderActionProps.navigateToEditMemberProfileScreen
    ).toHaveBeenCalled();
  });

  it('should have a edit Icon Button', () => {
    const header = renderer.create(
      <ContactInfoHeader
        {...contactInfoHeaderProps}
        {...contactInfoHeaderActionProps}
      />
    );
    const iconButton = header.root.findByType(IconButton);
    expect(iconButton.type).toEqual(IconButton);
    expect(iconButton.props.iconName).toEqual('pen');
    expect(iconButton.props.onPress).toEqual(expect.any(Function));
    expect(iconButton.props.accessibilityLabel).toEqual('edit');
    expect(iconButton.props.viewStyle).toEqual(
      contactInfoHeaderStyles.editButtonViewStyle
    );
    expect(iconButton.props.iconTextStyle).toEqual(
      contactInfoHeaderStyles.editButtonIconTextStyle
    );
    expect(iconButton.props.iconSolid).toEqual(true);
  });

  it('should display edit button', () => {
    const header = renderer.create(
      <ContactInfoHeader
        {...contactInfoHeaderActionProps}
        isPrimary={true}
        name='Thomas Young'
      />
    );
    expect(header.root.findAllByType(IconButton).length).toBe(1);
  });
});

describe('contactInfoHeaderStyles', () => {
  it('has expected styles', () => {
    const titleTextStyle: TextStyle = {
      color: PurpleScale.darkest,
      fontSize: FontSize.larger,
      lineHeight: 33,
    };

    const primaryTextStyle: TextStyle = {
      color: GreyScale.regular,
      fontSize: FontSize.small,
      lineHeight: 33,
      marginLeft: Spacing.threeQuarters,
    };

    const contactInfoHeaderViewStyle: ViewStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.half,
    };

    const editButtonViewStyle: ViewStyle = {
      alignContent: 'flex-end',
      alignItems: 'center',
      flexGrow: 0,
      height: 33,
      justifyContent: 'center',
      width: 50,
    };

    const editButtonIconTextStyle: TextStyle = {
      fontSize: IconSize.small,
    };

    const baseTextViewStyle: ViewStyle = {
      justifyContent: 'flex-start',
      flexDirection: 'row',
    };

    const expectedContactInfoHeaderStyles: IContactInfoHeaderStyles = {
      titleTextStyle,
      primaryTextStyle,
      contactInfoHeaderViewStyle,
      editButtonViewStyle,
      editButtonIconTextStyle,
      baseTextViewStyle,
    };

    expect(contactInfoHeaderStyles).toEqual(expectedContactInfoHeaderStyles);
  });
});
