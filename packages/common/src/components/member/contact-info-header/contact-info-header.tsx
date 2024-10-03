// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View, TextStyle, ViewStyle } from 'react-native';
import { PrimaryText } from '../../../theming/constants';
import { FontSize, GreyScale, PurpleScale } from '../../../theming/theme';
import { Spacing } from '../../../theming/spacing';
import { IconButton } from '../../buttons/icon/icon.button';
import { BaseText } from '../../text/base-text/base-text';
import { IconSize } from '../../../theming/icons';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

export interface IContactInfoHeaderProps {
  name: string;
  isPrimary: boolean;
}

export interface IContactInfoHeaderActionProps {
  navigateToEditMemberProfileScreen: () => void;
}

export const ContactInfoHeader: React.SFC<
  IContactInfoHeaderProps & IContactInfoHeaderActionProps
> = (props) => {
  const isPrimary = props.isPrimary ? PrimaryText : '';
  const accessibilityLabel = 'edit';
  return (
    <View style={styles.contactInfoHeaderViewStyle}>
      <View style={styles.baseTextViewStyle}>
        <ProtectedBaseText
          children={props.name}
          style={styles.titleTextStyle}
        />
        <BaseText children={isPrimary} style={styles.primaryTextStyle} />
      </View>
      <IconButton
        iconName='pen'
        onPress={props.navigateToEditMemberProfileScreen}
        accessibilityLabel={accessibilityLabel}
        viewStyle={styles.editButtonViewStyle}
        iconTextStyle={styles.editButtonIconTextStyle}
        iconSolid={true}
      />
    </View>
  );
};

export interface IContactInfoHeaderStyles {
  titleTextStyle: TextStyle;
  primaryTextStyle: TextStyle;
  contactInfoHeaderViewStyle: ViewStyle;
  editButtonViewStyle: ViewStyle;
  editButtonIconTextStyle: TextStyle;
  baseTextViewStyle: ViewStyle;
}

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

export const contactInfoHeaderStyles: IContactInfoHeaderStyles = {
  titleTextStyle,
  primaryTextStyle,
  contactInfoHeaderViewStyle,
  editButtonViewStyle,
  editButtonIconTextStyle,
  baseTextViewStyle,
};

const styles = contactInfoHeaderStyles;
