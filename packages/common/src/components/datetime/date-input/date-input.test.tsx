// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { TextStyle, View, ViewStyle } from 'react-native';
import { DateInput } from './date-input';
import { dateInputStyles } from './date-input.styles';
import { LabelText } from '../../primitives/label-text';
import { dateInputContent } from './date-input.content';
import { BasePicker } from '../../member/pickers/base/base.picker';
import { BaseText } from '../../text/base-text/base-text';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';

jest.mock('../../member/pickers/base/base.picker', () => ({
  BasePicker: () => <div />,
}));

jest.mock('react', () => ({
  ...(jest.requireActual('react') as object),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

const setHasDayErrorMock = jest.fn();
const setHasMonthErrorMock = jest.fn();
const setHasYearErrorMock = jest.fn();
const setHasDateErrorMock = jest.fn();
const setMonthMock = jest.fn();
const setDayMock = jest.fn();
const setYearMock = jest.fn();

interface IStateMock {
  hasDayError?: boolean;
  hasMonthError?: boolean;
  hasYearError?: boolean;
  hasDateError?: boolean;
  month: string;
  day: string;
  year: string;
}

const defaultStateMock: IStateMock = {
  month: '',
  day: '',
  year: '',
};

enum InputFieldsEnum {
  month,
  day,
  year,
}

describe('DateInput', () => {
  beforeEach(() => {
    useEffectMock.mockReset();
    stateReset(defaultStateMock);
  });

  it('renders in View container with expected properties', () => {
    const customViewStyle: ViewStyle = { backgroundColor: 'red' };
    const testRenderer = renderer.create(
      <DateInput onChange={jest.fn()} viewStyle={customViewStyle} />
    );

    const container = testRenderer.root.findByType(View);

    expect(container.props.style).toEqual([
      dateInputStyles.containerViewStyle,
      customViewStyle,
    ]);
  });

  it('renders input components in View container with expected properties', () => {
    const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

    const inputsContainer =
      testRenderer.root.findByType(View).props.children[0];

    expect(inputsContainer.type).toEqual(View);
    expect(inputsContainer.props.style).toEqual(dateInputStyles.fieldViewStyle);
  });

  it('renders month picker in label with expected properties', () => {
    const customTextStyle: TextStyle = { color: 'yellow' };

    const testRenderer = renderer.create(
      <DateInput onChange={jest.fn()} textStyle={customTextStyle} />
    );

    const labels = testRenderer.root.findAllByType(LabelText);

    expect(labels[InputFieldsEnum.month].props.style).toEqual([
      dateInputStyles.fieldTextStyle,
      customTextStyle,
      { marginLeft: 0 },
    ]);
  });

  it('renders month label content with expected properties', () => {
    const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

    const monthLabel =
      testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.month];
    const contentText = monthLabel.props.children[0];

    expect(contentText.type).toEqual(BaseText);
    expect(contentText.props.style).toEqual(dateInputStyles.labelTextStyle);
    expect(contentText.props.children).toEqual(dateInputContent.monthLabel);
  });

  it('renders month picker with expected properties', () => {
    const month = new Date().getMonth() + 1;
    stateReset({ ...defaultStateMock, month: month.toString() });
    const mockedTestID = 'mockTestID';

    const testRenderer = renderer.create(
      <DateInput onChange={jest.fn()} testID={mockedTestID} />
    );

    const monthLabel =
      testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.month];
    const picker = monthLabel.props.children[1];

    expect(picker.type).toEqual(BasePicker);
    expect(picker.props.style).toEqual(dateInputStyles.monthInputTextStyle);
    expect(picker.props.selectedValue).toEqual(month.toString());
    expect(picker.props.testID).toBe(`${mockedTestID}MonthPicker`);
  });

  it('renders expected month picker items', () => {
    const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

    const monthLabel =
      testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.month];
    const picker = monthLabel.findByType(BasePicker);
    const pickerItems = picker.props.children;

    expect(pickerItems.length).toEqual(13);

    const expectedLabels: string[] = ['', ...dateInputContent.monthNames];
    pickerItems.forEach((item: ReactTestInstance, index: number) => {
      expect(item.props.value).toEqual(index ? index.toString() : '');
      expect(item.props.label).toEqual(expectedLabels[index]);
    });
  });

  it.each([
    ['', false],
    ['-1', true],
    ['0', true],
    ['1', false],
    ['1.1', true],
    ['12', false],
    ['13', true],
  ])(
    `sets month in state and validates when month input changes ('%s')`,
    (month: string, hasError: boolean) => {
      const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

      const monthLabel =
        testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.month];
      const picker = monthLabel.props.children[1];
      const onValueChange = picker.props.onValueChange;

      onValueChange(month);

      expect(setMonthMock).toHaveBeenCalledWith(month);
      expect(setHasMonthErrorMock).toHaveBeenCalledWith(hasError);
    }
  );

  it('renders day input in label with expected properties', () => {
    const customTextStyle: TextStyle = { color: 'yellow' };
    const testRenderer = renderer.create(
      <DateInput onChange={jest.fn()} textStyle={customTextStyle} />
    );

    const labels = testRenderer.root.findAllByType(LabelText);

    expect(labels[InputFieldsEnum.day].props.style).toEqual([
      dateInputStyles.fieldTextStyle,
      customTextStyle,
    ]);
  });

  it('renders day label content with expected properties', () => {
    const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

    const dayLabel =
      testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.day];
    const contentText = dayLabel.props.children[0];

    expect(contentText.type).toEqual(BaseText);
    expect(contentText.props.style).toEqual(dateInputStyles.labelTextStyle);
    expect(contentText.props.children).toEqual(dateInputContent.dayLabel);
  });

  it('renders day input with expected properties', () => {
    const defaultDay = new Date().getDate();
    const isDisabled = true;
    const mockedTestID = 'mockTestID';
    const testRenderer = renderer.create(
      <DateInput
        onChange={jest.fn()}
        defaultDay={defaultDay}
        disabled={isDisabled}
        testID={mockedTestID}
      />
    );

    const dayLabel =
      testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.day];
    const input = dayLabel.props.children[1];

    expect(input.type).toEqual(PrimaryTextInput);
    expect(input.props.defaultValue).toEqual(defaultDay.toString());
    expect(input.props.editable).toEqual(!isDisabled);
    expect(input.props.keyboardType).toEqual('numeric');
    expect(input.props.selectTextOnFocus).toEqual(true);
    expect(input.props.viewStyle).toEqual([
      dateInputStyles.dayInputViewStyle,
      undefined,
    ]);
    expect(input.props.testID).toBe(`${mockedTestID}DayInput`);
  });

  it.each([
    ['', false],
    ['-1', true],
    ['0', true],
    ['1', false],
    ['1.1', true],
    ['1.1', true],
    ['31', false],
    ['32', true],
  ])(
    `sets day in state and validates when day input changes ('%s')`,
    (day: string, hasError: boolean) => {
      const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

      const dayLabel =
        testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.day];
      const input = dayLabel.props.children[1];
      const onChangeText = input.props.onChangeText;

      onChangeText(day);

      expect(setDayMock).toHaveBeenCalledWith(day);
      expect(setHasDayErrorMock).toHaveBeenCalledWith(hasError);
    }
  );

  it('renders year input in label with expected properties', () => {
    const customTextStyle: TextStyle = { color: 'yellow' };
    const testRenderer = renderer.create(
      <DateInput onChange={jest.fn()} textStyle={customTextStyle} />
    );

    const labels = testRenderer.root.findAllByType(LabelText);

    expect(labels[InputFieldsEnum.year].props.style).toEqual([
      dateInputStyles.fieldTextStyle,
      customTextStyle,
      { marginRight: 0 },
    ]);
  });

  it('renders year label content with expected properties', () => {
    const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

    const yearLabel =
      testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.year];
    const contentText = yearLabel.props.children[0];

    expect(contentText.type).toEqual(BaseText);
    expect(contentText.props.style).toEqual(dateInputStyles.labelTextStyle);
    expect(contentText.props.children).toEqual(dateInputContent.yearLabel);
  });

  it('renders year input with expected properties', () => {
    const defaultYear = new Date().getFullYear();
    const isDisabled = true;
    const mockedTestID = 'mockTestID';
    const testRenderer = renderer.create(
      <DateInput
        onChange={jest.fn()}
        defaultYear={defaultYear}
        disabled={isDisabled}
        testID={mockedTestID}
      />
    );

    const yearLabel =
      testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.year];
    const input = yearLabel.props.children[1];

    expect(input.type).toEqual(PrimaryTextInput);
    expect(input.props.defaultValue).toEqual(defaultYear.toString());
    expect(input.props.editable).toEqual(!isDisabled);
    expect(input.props.keyboardType).toEqual('numeric');
    expect(input.props.selectTextOnFocus).toEqual(true);
    expect(input.props.viewStyle).toEqual([
      dateInputStyles.yearInputViewStyle,
      undefined,
    ]);
    expect(input.props.testID).toBe(`${mockedTestID}YearInput`);
  });

  it.each([
    ['', false],
    ['-1', true],
    ['0', true],
    ['1899', true],
    ['1899', true],
    ['1900', false],
    ['1900.1', true],
  ])(
    `sets year in state and validates when year input changes ('%s')`,
    (year: string, hasError: boolean) => {
      const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

      const yearLabel =
        testRenderer.root.findAllByType(LabelText)[InputFieldsEnum.year];
      const input = yearLabel.props.children[1];
      const onChangeText = input.props.onChangeText;

      onChangeText(year);

      expect(setYearMock).toHaveBeenCalledWith(year);
      expect(setHasYearErrorMock).toHaveBeenCalledWith(hasError);
    }
  );

  it.each([
    [defaultStateMock, false, ''],
    [
      { ...defaultStateMock, hasMonthError: true, hasDateError: true },
      true,
      dateInputContent.monthErrorMessage,
    ],
    [
      { ...defaultStateMock, hasDayError: true, hasDateError: true },
      true,
      dateInputContent.dayErrorMessage,
    ],
    [
      { ...defaultStateMock, hasDateError: true },
      true,
      dateInputContent.dateErrorMessage,
    ],
  ])(
    `renders expected field error (%#)`,
    (stateMock: IStateMock, isRendered: boolean, expectedMessage?: string) => {
      stateReset(stateMock);
      const testRenderer = renderer.create(<DateInput onChange={jest.fn()} />);

      const fieldError = testRenderer.root.findByType(View).props.children[1];

      if (!isRendered) {
        expect(fieldError).toBeNull();
      } else {
        expect(fieldError.type).toEqual(BaseText);
        expect(fieldError.props.style).toEqual(
          dateInputStyles.fieldErrorTextStyle
        );
        expect(fieldError.props.children).toEqual(expectedMessage);
      }
    }
  );

  it.each([
    [undefined, 1900],
    [2020, 2020],
  ])(
    `renders expected year field error (%p)`,
    (minimumYear: number | undefined, expectedMinimum: number) => {
      stateReset({
        ...defaultStateMock,
        hasYearError: true,
        hasDateError: true,
      });
      const testRenderer = renderer.create(
        <DateInput onChange={jest.fn()} minimumYear={minimumYear} />
      );

      const fieldError = testRenderer.root.findByType(View).props.children[1];

      expect(fieldError.type).toEqual(BaseText);
      expect(fieldError.props.style).toEqual(
        dateInputStyles.fieldErrorTextStyle
      );
      expect(fieldError.props.children).toEqual(
        dateInputContent.yearErrorMessage(expectedMinimum)
      );
    }
  );

  it.each([
    ['', '', '', true, false, undefined],
    ['1', '1', '1', true, false, new Date(1, 0, 1)],
    ['1.1', '1', '1', true, true, undefined],
    ['1', '1.1', '1', true, true, undefined],
    ['1', '1', '1.1', true, true, undefined],
    ['2021', '2', '28', true, false, new Date(2021, 1, 28)],
    ['2021', '2', '29', true, true, undefined],
    ['2020', '2', '29', true, false, new Date(2020, 1, 29)],
    ['2020', '2', '30', true, true, undefined],
    ['2020', '2', '30', false, false, undefined],
  ])(
    `validates full date and returns expected date when input changes ('%s','%s','%s',%s)`,
    (
      year: string,
      month: string,
      day: string,
      areAllInputsValidated: boolean,
      hasError: boolean,
      expectedDate?: Date
    ) => {
      const hasYearError = areAllInputsValidated ? false : undefined;
      const hasMonthError = areAllInputsValidated ? false : undefined;
      const hasDayError = areAllInputsValidated ? false : undefined;
      stateReset({
        ...defaultStateMock,
        year,
        month,
        day,
        hasDayError,
        hasMonthError,
        hasYearError,
      });

      const onChangeMock = jest.fn();
      renderer.create(<DateInput onChange={onChangeMock} />);

      expect(useEffectMock.mock.calls.length).toEqual(4);
      const effectHandler = useEffectMock.mock.calls[1][0];
      const effectCondition = useEffectMock.mock.calls[1][1];

      expect(effectCondition).toEqual([year, month, day]);

      effectHandler();
      expect(setHasDateErrorMock).toHaveBeenCalledWith(hasError);
      expect(onChangeMock).toHaveBeenCalledWith(expectedDate);
    }
  );

  it('calls change handlers for default values', () => {
    const defaultYear = 2020;
    const defaultMonth = 8;
    const defaultDay = 6;

    renderer.create(
      <DateInput
        onChange={jest.fn()}
        defaultYear={defaultYear}
        defaultMonth={defaultMonth}
        defaultDay={defaultDay}
      />
    );

    expect(useEffectMock.mock.calls.length).toEqual(4);
    const defaultEffectHandler = useEffectMock.mock.calls[0][0];
    const defaultEffectCondition = useEffectMock.mock.calls[0][1];

    expect(defaultEffectCondition).toEqual([
      defaultYear,
      defaultMonth,
      defaultDay,
    ]);

    defaultEffectHandler();

    expect(setMonthMock).toHaveBeenCalledWith(defaultMonth.toString());
    expect(setHasMonthErrorMock).toHaveBeenCalledWith(false);

    expect(setDayMock).toHaveBeenCalledWith(defaultDay.toString());
    expect(setHasDayErrorMock).toHaveBeenCalledWith(false);

    expect(setYearMock).toHaveBeenCalledWith(defaultYear.toString());
    expect(setHasYearErrorMock).toHaveBeenCalledWith(false);
  });

  function stateReset(stateMock: IStateMock) {
    setHasDayErrorMock.mockReset();
    setHasMonthErrorMock.mockReset();
    setHasYearErrorMock.mockReset();
    setHasDateErrorMock.mockReset();
    setMonthMock.mockReset();
    setDayMock.mockReset();
    setYearMock.mockReset();

    useStateMock.mockReset();
    useStateMock
      .mockReturnValueOnce([stateMock.hasDayError, setHasDayErrorMock])
      .mockReturnValueOnce([stateMock.hasMonthError, setHasMonthErrorMock])
      .mockReturnValueOnce([stateMock.hasYearError, setHasYearErrorMock])
      .mockReturnValueOnce([stateMock.hasDateError, setHasDateErrorMock])
      .mockReturnValueOnce([stateMock.month, setMonthMock])
      .mockReturnValueOnce([stateMock.day, setDayMock])
      .mockReturnValueOnce([stateMock.year, setYearMock]);
  }
});
