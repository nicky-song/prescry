// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import renderer from 'react-test-renderer';
import {
  AppointmentCalendar,
  IAppointmentCalendarActionProps,
  IAppointmentCalendarProps,
} from './appointment-calendar';
import { appointmentCalendarStyle } from '../../../theming/member/appointment-calendar/appointment-calendar.style';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const setDisableArrowLeft = jest.fn();
const setDisableArrowRight = jest.fn();

const mockAppointmentCalendarProps: IAppointmentCalendarProps &
  IAppointmentCalendarActionProps = {
  onMonthChange: jest.fn(),
  onDateSelected: jest.fn(),
  markedDates: {},
  minDay: '2020-12-02',
  maxDay: '2021-03-02',
  currentMonth: '2020-12-01',
};

describe('AppointmentCalendar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValue([true, setDisableArrowLeft]);
    useStateMock.mockReturnValue([false, setDisableArrowRight]);
  });
  it('renders calendar component with expected properties', () => {
    const testRenderer = renderer.create(
      <AppointmentCalendar {...mockAppointmentCalendarProps} />
    );
    const testCalendarInstance = testRenderer.root.findByType(Calendar);
    expect(testCalendarInstance.props.current).toEqual('2020-12-01');
    expect(testCalendarInstance.props.minDate).toEqual('2020-12-02');
    expect(testCalendarInstance.props.maxDate).toEqual('2021-03-02');
    expect(testCalendarInstance.props.markedDates).toEqual({});
  });

  it('renders arrows components', () => {
    const testRenderer = renderer.create(
      <AppointmentCalendar
        {...mockAppointmentCalendarProps}
        onDateSelected={jest.fn()}
      />
    );
    const testIconInstance = testRenderer.root.findAllByType(FontAwesomeIcon);
    expect(testIconInstance.length).toEqual(2);
  });

  it('disables left arrow on page loading', () => {
    useStateMock.mockReturnValueOnce([true, setDisableArrowLeft]);
    useStateMock.mockReturnValueOnce([false, setDisableArrowRight]);
    const testRenderer = renderer.create(
      <AppointmentCalendar {...mockAppointmentCalendarProps} />
    );
    const disabledLeftArrowStyleMock = [
      appointmentCalendarStyle.leftArrowViewStyle,
      appointmentCalendarStyle.arrowDisabledViewStyle,
    ];
    const enabledRightArrowStyleMock = [
      appointmentCalendarStyle.rightArrowViewStyle,
      appointmentCalendarStyle.arrowEnabledViewStyle,
    ];

    const icons = testRenderer.root.findAllByType(FontAwesomeIcon);
    expect(icons[0].props.name).toEqual('chevron-left');
    expect(icons[0].props.style).toEqual(disabledLeftArrowStyleMock);
    expect(icons[1].props.style).toEqual(enabledRightArrowStyleMock);
  });

  it('Disables right arrow if max date is with in 30 days of min day and in same month', () => {
    useStateMock.mockReturnValueOnce([true, setDisableArrowRight]);
    useStateMock.mockReturnValueOnce([true, setDisableArrowLeft]);
    const mockProps: IAppointmentCalendarProps &
      IAppointmentCalendarActionProps = {
      onMonthChange: jest.fn(),
      onDateSelected: jest.fn(),
      markedDates: {},
      minDay: '2021-03-12',
      maxDay: '2021-03-23',
      currentMonth: '2021-03-01',
    };

    renderer.create(<AppointmentCalendar {...mockProps} />);
    expect(useStateMock).toHaveBeenNthCalledWith(1, true);
    expect(useStateMock).toHaveBeenNthCalledWith(2, true);
  });

  it('disables right arrow if min date is equal to max date', () => {
    useStateMock.mockReturnValueOnce([true, setDisableArrowRight]);
    useStateMock.mockReturnValueOnce([true, setDisableArrowLeft]);
    const mockProps: IAppointmentCalendarProps &
      IAppointmentCalendarActionProps = {
      onMonthChange: jest.fn(),
      onDateSelected: jest.fn(),
      markedDates: {},
      minDay: '2021-03-31',
      maxDay: '2021-03-31',
      currentMonth: '2021-03-31',
    };

    renderer.create(<AppointmentCalendar {...mockProps} />);
    expect(useStateMock).toHaveBeenNthCalledWith(1, true);
    expect(useStateMock).toHaveBeenNthCalledWith(2, true);
  });

  it('Enables right arrow if max date is with in 30 days of min day and in different month', () => {
    useStateMock.mockReturnValueOnce([true, setDisableArrowRight]);
    useStateMock.mockReturnValueOnce([true, setDisableArrowLeft]);
    const mockProps: IAppointmentCalendarProps &
      IAppointmentCalendarActionProps = {
      onMonthChange: jest.fn(),
      onDateSelected: jest.fn(),
      markedDates: {},
      minDay: '2021-03-12',
      maxDay: '2021-04-09',
      currentMonth: '2021-03-01',
    };

    renderer.create(<AppointmentCalendar {...mockProps} />);
    expect(useStateMock).toHaveBeenNthCalledWith(1, true);
    expect(useStateMock).toHaveBeenNthCalledWith(2, false);
  });

  it('Enables right arrow if max date is after 30 days of min day', () => {
    useStateMock.mockReturnValueOnce([true, setDisableArrowRight]);
    useStateMock.mockReturnValueOnce([true, setDisableArrowLeft]);
    const mockProps: IAppointmentCalendarProps &
      IAppointmentCalendarActionProps = {
      onMonthChange: jest.fn(),
      onDateSelected: jest.fn(),
      markedDates: {},
      minDay: '2021-03-17',
      maxDay: '2021-06-09',
      currentMonth: '2021-04-01',
    };

    renderer.create(<AppointmentCalendar {...mockProps} />);
    expect(useStateMock).toHaveBeenNthCalledWith(1, true);
    expect(useStateMock).toHaveBeenNthCalledWith(2, false);
  });

  it('Enables right arrow if max date and min day have 1 day difference', () => {
    useStateMock.mockReturnValueOnce([true, setDisableArrowRight]);
    useStateMock.mockReturnValueOnce([true, setDisableArrowLeft]);
    const mockProps: IAppointmentCalendarProps &
      IAppointmentCalendarActionProps = {
      onMonthChange: jest.fn(),
      onDateSelected: jest.fn(),
      markedDates: {},
      minDay: '2021-03-31',
      maxDay: '2021-04-02',
      currentMonth: '2021-03-31',
    };

    renderer.create(<AppointmentCalendar {...mockProps} />);
    expect(useStateMock).toHaveBeenNthCalledWith(1, true);
    expect(useStateMock).toHaveBeenNthCalledWith(2, false);
  });

  it('renders calendar with both arrows enabled if current month falls in between min and max Date', () => {
    const props = {
      ...mockAppointmentCalendarProps,
      currentMonth: '2021-01-01',
    };
    useStateMock.mockReturnValueOnce([false, setDisableArrowLeft]);
    useStateMock.mockReturnValueOnce([false, setDisableArrowRight]);

    const testRenderer = renderer.create(<AppointmentCalendar {...props} />);

    const rightArrowStyleMock = [
      appointmentCalendarStyle.rightArrowViewStyle,
      appointmentCalendarStyle.arrowEnabledViewStyle,
    ];

    const leftArrowStyleMock = [
      appointmentCalendarStyle.leftArrowViewStyle,
      appointmentCalendarStyle.arrowEnabledViewStyle,
    ];

    const icons = testRenderer.root.findAllByType(FontAwesomeIcon);
    expect(icons[0].props.name).toEqual('chevron-left');
    expect(icons[0].props.style).toEqual(leftArrowStyleMock);

    expect(icons[1].props.name).toEqual('chevron-right');
    expect(icons[1].props.style).toEqual(rightArrowStyleMock);
  });
});
