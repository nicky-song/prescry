// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { TextStyle, View, StyleProp, ViewStyle } from 'react-native';
import { pharmacyHoursContainerStyles } from './pharmacy-hours-container.styles';
import { BaseText } from '../../text/base-text/base-text';
import { pharmacyHoursContainerContent } from './pharmacy-hours-container.content';
import {
  ExpandableCard,
  ExpandableCardState,
} from '../../cards/expandable/expandable.card';
export interface IPharmacyHoursContainerProps {
  pharmacyHours: Map<string, string>;
  isCollapsed?: boolean;
  isSkeleton?: boolean;
  textStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
}

export const PharmacyHoursContainer = ({
  pharmacyHours,
  isCollapsed = true,
  isSkeleton,
  textStyle,
  viewStyle,
}: IPharmacyHoursContainerProps): ReactElement => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const expandableCardState: ExpandableCardState = isCollapsed
    ? 'collapsed'
    : 'expanded';

  const today = new Date();
  const todayHours = days[today.getDay()];

  const renderTodaysHours = pharmacyHours.get(todayHours);

  const renderFullPharmacyHours = Array.from(pharmacyHours.entries()).map(
    (dayContent, key) => {
      return (
        <View
          style={pharmacyHoursContainerStyles.subContainerViewStyle}
          key={key}
        >
          <View style={pharmacyHoursContainerStyles.pharmacyDayViewStyle}>
            <BaseText
              style={textStyle}
              isSkeleton={isSkeleton}
              skeletonWidth='short'
            >
              {dayContent[0]}
            </BaseText>
          </View>
          <View style={pharmacyHoursContainerStyles.pharmacyHoursViewStyle}>
            <BaseText
              style={[pharmacyHoursContainerStyles.hoursTextStyle, textStyle]}
              isSkeleton={isSkeleton}
              skeletonWidth='short'
            >
              {dayContent[1]}
            </BaseText>
          </View>
        </View>
      );
    }
  );

  const renderTodayHours = (
    <View style={pharmacyHoursContainerStyles.subContainerViewStyle}>
      <View style={pharmacyHoursContainerStyles.pharmacyDayViewStyle}>
        <BaseText
          style={textStyle}
          isSkeleton={isSkeleton}
          skeletonWidth='short'
        >
          {pharmacyHoursContainerContent.today}
        </BaseText>
      </View>
      <View style={pharmacyHoursContainerStyles.pharmacyHoursViewStyle}>
        <BaseText
          style={[pharmacyHoursContainerStyles.hoursTextStyle, textStyle]}
          isSkeleton={isSkeleton}
          skeletonWidth='short'
        >
          {renderTodaysHours}
        </BaseText>
      </View>
    </View>
  );

  return (
    <ExpandableCard
      initialState={expandableCardState}
      collapsedTitle={pharmacyHoursContainerContent.pharmacyHours}
      collapsedContent={renderTodayHours}
      expandedContent={renderFullPharmacyHours}
      isSingleton={true}
      hideLine={true}
      viewStyle={viewStyle}
    />
  );
};
