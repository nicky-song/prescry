// Copyright 2020 Prescryptive Health, Inc.

import moment from 'moment';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { appointmentCalendarStyle } from '../../../theming/member/appointment-calendar/appointment-calendar.style';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

export interface IMarkedDate {
  [date: string]: {
    disabled?: boolean;
    disableTouchEvent?: boolean;
    selected?: boolean;
  };
}

export interface IAppointmentCalendarProps {
  markedDates: IMarkedDate;
  minDay: string;
  maxDay: string;
  currentMonth?: string;
}

export interface IAppointmentCalendarActionProps {
  onDateSelected?: (date: DateData) => void;
  onMonthChange: (date: DateData) => void;
}

export const AppointmentCalendar = (
  props: IAppointmentCalendarProps & IAppointmentCalendarActionProps
) => {
  const disableRightArrow = () =>
    moment(props.maxDay)
      .endOf('day')
      .diff(moment(props.currentMonth).endOf('month'), 'days') <= 0;

  const [disableArrowLeft, setDisableArrowLeft] = useState(true);
  const [disableArrowRight, setDisableArrowRight] = useState(
    disableRightArrow()
  );
  const renderArrow = (direction: string): React.ReactNode => {
    const iconName = direction === 'left' ? 'chevron-left' : 'chevron-right';
    let styles = disableArrowRight
      ? [
          appointmentCalendarStyle.rightArrowViewStyle,
          appointmentCalendarStyle.arrowDisabledViewStyle,
        ]
      : [
          appointmentCalendarStyle.rightArrowViewStyle,
          appointmentCalendarStyle.arrowEnabledViewStyle,
        ];
    if (direction === 'left') {
      styles = disableArrowLeft
        ? [
            appointmentCalendarStyle.leftArrowViewStyle,
            appointmentCalendarStyle.arrowDisabledViewStyle,
          ]
        : [
            appointmentCalendarStyle.leftArrowViewStyle,
            appointmentCalendarStyle.arrowEnabledViewStyle,
          ];
    }
    return <FontAwesomeIcon name={iconName} size={24} style={styles} />;
  };

  const onMonthChange = (date: DateData): void => {
    setDisableArrowRight(
      moment(props.maxDay).diff(moment(date), 'months', true) <= 0
    );
    setDisableArrowLeft(
      moment(date.timestamp).isSameOrBefore(moment(props.minDay))
    );

    props.onMonthChange(date);
  };
  return (
    <View
      style={appointmentCalendarStyle.calendarThemeViewStyle}
      testID='appointmentCalendar'
    >
      <Calendar
        theme={appointmentCalendarStyle.calendarThemeStyle}
        current={props.currentMonth || props.minDay}
        hideArrows={false}
        renderArrow={renderArrow}
        hideExtraDays={true}
        onDayPress={props.onDateSelected}
        minDate={props.minDay}
        maxDate={props.maxDay}
        onMonthChange={onMonthChange}
        markedDates={props.markedDates}
        disableArrowLeft={disableArrowLeft}
        disableArrowRight={disableArrowRight}
      />
    </View>
  );
};
