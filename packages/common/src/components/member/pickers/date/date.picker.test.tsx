// Copyright 2018 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Label } from '../../../text/label/label';
import {
  DatePicker,
  IDatePickerProps,
  PickerWrapper,
  IDatePickerState,
} from './date.picker';
import { datePickerStyles } from './date.picker.style';
import { View } from 'react-native';
import { BasePicker } from '../base/base.picker';
import { datePickerContent } from './date.picker.content';

jest.mock('../base/base.picker', () => ({
  BasePicker: () => <div />,
}));

jest.mock('react', () => ({
  ...(jest.requireActual('react') as object),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

jest.mock('../../../text/label/label', () => ({
  Label: () => <div />,
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../../../theming/constants', () => ({
  EndYearForDateOfBirth: 1900,
  StartYearForDateOfBirth: 2006,
}));

const mockGetSelectedDate = jest.fn();
const setDatePickerMock = jest.fn();

const datePickerProps: IDatePickerProps = {
  getSelectedDate: mockGetSelectedDate,
};

const defaultDatePicker: IDatePickerState = {
  days: datePickerContent.dayKey,
  months: datePickerContent.monthKey,
  selectedDate: '',
  years: datePickerContent.yearKey,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSelectedDate.mockReset();
  useStateMock.mockReturnValue([defaultDatePicker, setDatePickerMock]);
});

describe('DatePicker', () => {
  it.each([[undefined], [true], [false]])(
    'renders in PickerWrapper',
    (isSkeleton?: boolean) => {
      const labelMock = 'label';
      const isRequiredMock = true;
      const testRenderer = renderer.create(
        <DatePicker
          label={labelMock}
          isRequired={isRequiredMock}
          getSelectedDate={jest.fn()}
          isSkeleton={isSkeleton}
        />
      );

      expect(useEffectMock.mock.calls[0][1]).toEqual([]);
      expect(useEffectMock.mock.calls[1][1]).toEqual([defaultDatePicker]);

      const wrapper = testRenderer.root.children[0] as ReactTestInstance;
      expect(wrapper.type).toEqual(PickerWrapper);
      expect(wrapper.props.isRequired).toEqual(isRequiredMock);
      expect(wrapper.props.isSkeleton).toEqual(isSkeleton ?? false);
      expect(wrapper.props.children).toBeDefined();
    }
  );

  it('renders picker container', () => {
    const testRenderer = renderer.create(
      <DatePicker getSelectedDate={jest.fn()} />
    );

    const wrapper = testRenderer.root.findByType(PickerWrapper);
    const pickerContainer = wrapper.props.children;

    expect(pickerContainer.type).toEqual(View);
    expect(pickerContainer.props.style).toEqual(
      datePickerStyles.containerViewStyle
    );
    expect(pickerContainer.props.children.length).toEqual(3);
  });

  it('renders picker container with content props', () => {
    const mockMonthList = ['month-mock'];
    const mockDayLabel = 'day-label-mock';
    const mockMonthLabel = 'month-label-mock';
    const mockYearLabel = 'year-label-mock';

    const testRenderer = renderer.create(
      <DatePicker
        getSelectedDate={jest.fn()}
        monthList={mockMonthList}
        dayLabel={mockDayLabel}
        monthLabel={mockMonthLabel}
        yearLabel={mockYearLabel}
      />
    );

    const wrapper = testRenderer.root.findByType(PickerWrapper);
    const pickerContainer = wrapper.props.children;

    expect(pickerContainer.type).toEqual(View);
    expect(pickerContainer.props.style).toEqual(
      datePickerStyles.containerViewStyle
    );
    expect(pickerContainer.props.children.length).toEqual(3);
    const monthPicker = pickerContainer.props.children[0].props.children;
    expect(monthPicker.length).toEqual(13);
    expect(monthPicker[0].props.label).toEqual(mockMonthLabel);
    expect(monthPicker[1].props.label).toEqual(mockMonthList[0]);
    for (let monthNumber = 1; monthNumber < monthPicker.length; monthNumber++) {
      expect(monthPicker[monthNumber].props.testID).toEqual(
        `datePickerMonth-${monthNumber}`
      );
    }

    const dayPicker = pickerContainer.props.children[1].props.children;
    expect(dayPicker.length).toEqual(32);
    expect(dayPicker[0].props.label).toEqual(mockDayLabel);

    const yearPicker = pickerContainer.props.children[2].props.children;
    expect(yearPicker.length).toEqual(108);
    expect(yearPicker[0].props.label).toEqual(mockYearLabel);
  });

  it('should have first Picker component with selectedValue as mm', () => {
    const testRenderer = renderer.create(<DatePicker {...datePickerProps} />);

    const wrapper = testRenderer.root.findByType(PickerWrapper);
    const pickerContainer = wrapper.props.children;
    const monthPicker = pickerContainer.props.children[0];

    expect(monthPicker.type).toEqual(BasePicker);
    expect(monthPicker.props.selectedValue).toBe('mm');
    expect(monthPicker.props.children.length).toBe(13);
  });

  it('should have second Picker component with selectedValue as dd', () => {
    const testRenderer = renderer.create(<DatePicker {...datePickerProps} />);

    const wrapper = testRenderer.root.findByType(PickerWrapper);
    const pickerContainer = wrapper.props.children;
    const dayPicker = pickerContainer.props.children[1];

    expect(dayPicker.type).toEqual(BasePicker);
    expect(dayPicker.props.selectedValue).toBe('dd');
    expect(dayPicker.props.children.length).toBe(32);
  });

  it('should have third Picker component with selectedValue as yyyy', () => {
    const testRenderer = renderer.create(<DatePicker {...datePickerProps} />);

    const wrapper = testRenderer.root.findByType(PickerWrapper);
    const pickerContainer = wrapper.props.children;
    const yearPicker = pickerContainer.props.children[2];

    expect(yearPicker.type).toEqual(BasePicker);
    expect(yearPicker.props.selectedValue).toBe('yyyy');
    expect(yearPicker.props.children.length).toBe(108);
  });

  it('should update days and should call getSelectedDate when day is changed', () => {
    const daysMock = '11';
    const datePicker = renderer.create(<DatePicker {...datePickerProps} />);
    const daysPicker =
      datePicker.root.findByType(PickerWrapper).props.children.props
        .children[1];

    daysPicker.props.onValueChange(daysMock);

    expect(setDatePickerMock).toHaveBeenCalledWith({
      ...defaultDatePicker,
      days: daysMock,
      selectedDate: 'mm-11-yyyy',
    });
  });

  it('should update months and should call getSelectedDate when month is changed', () => {
    const monthsMock = '01';
    const datePicker = renderer.create(<DatePicker {...datePickerProps} />);

    const daysPicker =
      datePicker.root.findByType(PickerWrapper).props.children.props
        .children[0];

    daysPicker.props.onValueChange(monthsMock);

    expect(setDatePickerMock).toHaveBeenCalledWith({
      ...defaultDatePicker,
      months: monthsMock,
      selectedDate: '01-dd-yyyy',
    });
  });

  it('should update years and should call getSelectedDate when year is changed', () => {
    const yearsMock = '1111';
    const datePicker = renderer.create(<DatePicker {...datePickerProps} />);

    const daysPicker =
      datePicker.root.findByType(PickerWrapper).props.children.props
        .children[2];

    daysPicker.props.onValueChange(yearsMock);

    expect(setDatePickerMock).toHaveBeenCalledWith({
      ...defaultDatePicker,
      years: yearsMock,
      selectedDate: 'mm-dd-1111',
    });
  });

  it('should have expected state when defaultValue property supplied', () => {
    const selectedDateMock = '2000/01/01';
    renderer.create(
      <DatePicker {...{ ...datePickerProps, defaultValue: selectedDateMock }} />
    );

    expect(useEffectMock.mock.calls[0][1]).toEqual([]);

    const processDateOfBirthIntoState = useEffectMock.mock.calls[0][0];

    processDateOfBirthIntoState();

    const convertedDate = new Date(selectedDateMock);
    const day = convertedDate.getUTCDate().toString().padStart(2, '0');
    const month = datePickerContent.monthList[convertedDate.getUTCMonth()];
    const year = convertedDate.getUTCFullYear().toString();

    expect(setDatePickerMock).toHaveBeenCalledWith({
      days: day,
      months: month,
      selectedDate: `${month}-${day}-${year}`,
      years: year,
    });
  });
});

describe('createYearsDropDownList', () => {
  it('should call createYearsDropDownList as expected when start and end year supplied ', () => {
    const startYearForDateOfBirth = new Date().getFullYear();
    const endYearForDateOfBirth = new Date().getFullYear() - 17;

    const rendered = renderer.create(
      <DatePicker
        {...{
          ...datePickerProps,
          startYearForDateOfBirth,
          endYearForDateOfBirth,
        }}
      />
    );

    const pickerWrapper = rendered.root.children[0] as ReactTestInstance;

    const basePickerProps =
      pickerWrapper.props.children.props.children[2].props;

    expect(basePickerProps.children[0].props.value).toEqual(
      datePickerContent.yearKey
    );
    expect(basePickerProps.children[0].props.label).toEqual(
      datePickerContent.yearLabel
    );
    expect(basePickerProps.selectedValue).toEqual(datePickerContent.yearKey);
    expect(basePickerProps.children[1].props.label).toEqual(
      startYearForDateOfBirth.toString()
    );
    expect(basePickerProps.children[18].props.label).toEqual(
      endYearForDateOfBirth.toString()
    );

    expect(rendered).toBeDefined();
  });
});

describe('PickerWrapper', () => {
  it.each([[undefined], [true], [false]])(
    'renders children in Label if label prop specified',
    (isSkeleton?: boolean) => {
      const labelMock = 'label';
      const isRequiredMock = true;
      const ChildMock = () => <div />;
      const testRenderer = renderer.create(
        <PickerWrapper
          label={labelMock}
          isRequired={isRequiredMock}
          isSkeleton={isSkeleton}
        >
          <ChildMock />
        </PickerWrapper>
      );

      const label = testRenderer.root.children[0] as ReactTestInstance;
      expect(label.type).toEqual(Label);
      expect(label.props.isRequired).toEqual(isRequiredMock);
      expect(label.props.isSkeleton).toEqual(isSkeleton);
      expect(label.props.children).toEqual(<ChildMock />);
    }
  );

  it('renders children directly if label prop not specified', () => {
    const ChildMock = () => <div />;
    const testRenderer = renderer.create(
      <PickerWrapper label={undefined}>
        <ChildMock />
      </PickerWrapper>
    );

    const children = testRenderer.root.children[0] as ReactTestInstance;
    expect(children.type).toEqual(ChildMock);
  });
});
