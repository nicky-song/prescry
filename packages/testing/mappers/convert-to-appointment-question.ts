// Copyright 2022 Prescryptive Health, Inc.

export const convertToAppointmentQuestion = (testDataAppointmentQuestion: {
  questionId: string;
  questionType: string;
  responseValue: string | string[];
}):
  | {
      id: string;
      type: 'text';
      value: string;
    }
  | {
      id: string;
      type: 'single-select';
      value: string;
    }
  | {
      id: string;
      type: 'multi-select';
      values: string[];
    }
  | {
      id: string;
      type: 'datepicker';
      value: { month: string; day: string; year: string };
    } => {
  if (
    testDataAppointmentQuestion.questionType === 'text' ||
    testDataAppointmentQuestion.questionType === 'single-select'
  ) {
    return {
      id: testDataAppointmentQuestion.questionId,
      type: testDataAppointmentQuestion.questionType,
      value: testDataAppointmentQuestion.responseValue as string,
    };
  }
  if (testDataAppointmentQuestion.questionType === 'multi-select') {
    return {
      id: testDataAppointmentQuestion.questionId,
      type: testDataAppointmentQuestion.questionType,
      values: testDataAppointmentQuestion.responseValue as string[],
    };
  }
  if (testDataAppointmentQuestion.questionType === 'datepicker') {
    const dateValue = new Date(
      `${testDataAppointmentQuestion.responseValue} 00:00:00`
    );
    return {
      id: testDataAppointmentQuestion.questionId,
      type: testDataAppointmentQuestion.questionType,
      value: {
        month: (dateValue.getMonth() + 1).toString(),
        day: dateValue.getDate().toString(),
        year: dateValue.getFullYear().toString(),
      },
    };
  }

  throw new Error('Question Type must be a valid one');
};
