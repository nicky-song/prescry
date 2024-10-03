// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { stylesheet } from '../../../../theming/member/stylesheet';

export interface IHomeFeedItemProps {
  caption?: string;
  description?: React.ReactNode;
  isStatic?: boolean;
  onPress?: () => void;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

const containerViewStyle: ViewStyle = {
  alignItems: 'stretch',
  flexDirection: 'row',
};

export class HomeFeedItem extends React.Component<IHomeFeedItemProps> {
  public render() {
    if (this.props.isStatic) {
      return this.renderStaticItem();
    }

    return this.renderClickableItem();
  }

  private renderStaticItem(): React.ReactNode {
    const viewStyle = this.props.description
      ? stylesheet.homeFeedStaticItemViewStyle
      : stylesheet.homeFeedStaticItemWithoutDescriptionViewStyle;

    return (
      <View
        style={[viewStyle, this.props.viewStyle]}
        testID={this.props.testID}
      >
        {this.renderCaption(stylesheet.homeFeedStaticItemCaptionTextStyle)}
        {this.renderDescription(
          stylesheet.homeFeedStaticItemDescriptionTextStyle
        )}
      </View>
    );
  }

  private renderClickableItem(): React.ReactNode {
    const viewStyle = stylesheet.homeFeedItemViewStyle;

    return (
      <View style={containerViewStyle}>
        <TouchableOpacity
          onPress={this.props.onPress}
          style={[viewStyle, this.props.viewStyle]}
        >
          {this.renderCaption(stylesheet.homeFeedItemCaptionTextStyle)}
          {this.renderDescription(stylesheet.homeFeedItemDescriptionTextStyle)}
        </TouchableOpacity>
      </View>
    );
  }

  private renderCaption(textStyle: TextStyle): React.ReactNode {
    if (!this.props.caption) {
      return null;
    }

    return <Text style={textStyle}>{this.props.caption}</Text>;
  }

  private renderDescription(textStyle: TextStyle): React.ReactNode {
    if (!this.props.description) {
      return null;
    }

    return <Text style={textStyle}>{this.props.description}</Text>;
  }
}
