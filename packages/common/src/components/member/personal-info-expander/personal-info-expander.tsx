// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { personalInfoExpanderContent } from './personal-info-expander.content';
import { personalInfoExpanderStyles } from './personal-info-expander.styles';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import DateFormatter from '../../../utils/formatters/date.formatter';
import { TranslatableBaseText } from '../../text/translated-base-text/translatable-base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { BaseText } from '../../text/base-text/base-text';

export interface IPersonalInfoExpanderDataProps {
  PersonalInfoExpanderData: {
    dateOfBirth?: string;
    name: string;
  };
  viewStyle?: StyleProp<ViewStyle>;
}

export interface IPersonalInfoExpanderState {
  showPersonalInfo?: boolean;
}

export class PersonalInfoExpander extends React.Component<
  IPersonalInfoExpanderDataProps,
  IPersonalInfoExpanderState
> {
  public state: IPersonalInfoExpanderState = {
    showPersonalInfo: false,
  };

  public render() {
    return (
      <View
        style={[personalInfoExpanderStyles.viewStyle, this.props.viewStyle]}
      >
        {!this.state.showPersonalInfo
          ? this.renderHeader()
          : this.renderContent()}
        <BaseText
          style={personalInfoExpanderStyles.iconContainerTextStyle}
          onPress={this.toggleExpand}
        >
          <FontAwesomeIcon
            style={personalInfoExpanderStyles.iconTextStyle}
            solid={true}
            name={this.state.showPersonalInfo ? 'chevron-up' : 'chevron-down'}
          />
        </BaseText>
      </View>
    );
  }

  private toggleExpand = (): void => {
    this.setState({
      showPersonalInfo: !this.state.showPersonalInfo,
    });
  };

  private renderHeader() {
    return (
      <View style={personalInfoExpanderStyles.headerViewStyle}>
        <BaseText style={personalInfoExpanderStyles.headerTextStyle}>
          {personalInfoExpanderContent.headerText}
        </BaseText>
      </View>
    );
  }

  private renderContent() {
    const rowList = [
      {
        rowName: personalInfoExpanderContent.name,
        rowValue: this.props.PersonalInfoExpanderData.name,
        translateContent: false,
      },
      {
        rowName: personalInfoExpanderContent.dateOfBirth,
        rowValue: this.getDate(this.props.PersonalInfoExpanderData.dateOfBirth),
        translateContent: true,
      },
    ];

    const renderRowItems = () => {
      return rowList.map((rowDetail, index) => {
        return (
          <View style={personalInfoExpanderStyles.itemRowViewStyle} key={index}>
            <TranslatableBaseText
              style={personalInfoExpanderStyles.rowNameTextStyle}
            >
              {rowDetail.rowName}
            </TranslatableBaseText>
            {rowDetail.translateContent ? (
              <TranslatableBaseText
                style={personalInfoExpanderStyles.rowValueTextStyle}
              >
                {rowDetail.rowValue}
              </TranslatableBaseText>
            ) : (
              <ProtectedBaseText
                style={personalInfoExpanderStyles.rowValueTextStyle}
              >
                {rowDetail.rowValue}
              </ProtectedBaseText>
            )}
          </View>
        );
      });
    };

    return (
      <View style={personalInfoExpanderStyles.contentViewStyle}>
        <BaseText>{renderRowItems()}</BaseText>
      </View>
    );
  }

  private getDate(date: string | undefined) {
    if (date) {
      return DateFormatter.formatStringToMMDDYYYY(date);
    }
    return;
  }
}
