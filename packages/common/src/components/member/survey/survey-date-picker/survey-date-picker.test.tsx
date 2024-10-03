// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SurveyDatePicker } from './survey-date-picker';
import { DateInput } from '../../../datetime/date-input/date-input';
import { surveyDatePickerStyles } from './survey-date-picker.styles';
import { getNewDate } from '../../../../utils/date-time/get-new-date';

jest.mock('../../../datetime/date-input/date-input', () => ({
  DateInput: () => <div />,
}));

jest.mock('../../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

const nowMock = new Date();

interface IStateCalls {
  lastValidDate: [Date, jest.Mock];
}

function stateReset({
  lastValidDate = [nowMock, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(lastValidDate);
}

describe('SurveyDatePicker', () => {
  beforeEach(() => {
    stateReset({});
    getNewDateMock.mockReturnValue(new Date());
  });

  it.each([[undefined], [new Date(2021, 11, 6)]])(
    'renders as DateInput (date: %p)',
    (dateMock: Date | undefined) => {
      const lastValidDateMock = new Date(2022, 1, 1);
      stateReset({ lastValidDate: [lastValidDateMock, jest.fn()] });
      getNewDateMock.mockReturnValue(nowMock);

      const onChangeMock = jest.fn();

      const minimumYearMock = 2001;

      const mockedTestID = 'mockTestID';

      const testRenderer = renderer.create(
        <SurveyDatePicker
          onChange={onChangeMock}
          date={dateMock}
          minimumYear={minimumYearMock}
          testID={mockedTestID}
        />
      );

      const input = testRenderer.root.children[0] as ReactTestInstance;

      expect(input.type).toEqual(DateInput);
      expect(input.props.onChange).toEqual(onChangeMock);
      expect(input.props.textStyle).toEqual(
        surveyDatePickerStyles.inputTextStyle
      );
      expect(input.props.minimumYear).toEqual(minimumYearMock);
      expect(input.props.testID).toBe(`${mockedTestID}Input`);

      if (!dateMock) {
        expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
          undefined,
        ]);

        const effectHandler = useEffectMock.mock.calls[0][0];
        effectHandler();
        expect(input.props.defaultYear).toEqual(
          lastValidDateMock.getFullYear()
        );
        expect(input.props.defaultMonth).toBeUndefined();
        expect(input.props.defaultDay).toBeUndefined();
      } else {
        expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
          dateMock,
        ]);

        const effectHandler = useEffectMock.mock.calls[0][0];
        effectHandler();
        expect(input.props.defaultYear).toEqual(dateMock.getFullYear());
        expect(input.props.defaultMonth).toEqual(dateMock.getMonth() + 1);
        expect(input.props.defaultDay).toEqual(dateMock.getDate());
      }
    }
  );
});
