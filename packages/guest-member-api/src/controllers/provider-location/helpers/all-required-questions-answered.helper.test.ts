// Copyright 2020 Prescryptive Health, Inc.

import { allRequiredQuestionsAnswered } from './all-required-questions-answered.helper';
import { IQuestionAnswer } from '@phx/common/src/models/question-answer';
import { IServiceQuestion } from '@phx/common/src/models/provider-location';

describe('allRequiredQuestionsAnswered', () => {
  it('should return true if all required questions are answered', () => {
    const questions = [
      {
        id: 'id1',
        isRequired: true,
      },
      {
        id: 'id2',
        isRequired: false,
      },
    ] as unknown as IServiceQuestion[];
    const answers = [
      {
        questionId: 'id1',
        answer: 'answered',
      },
    ] as IQuestionAnswer[];
    expect(allRequiredQuestionsAnswered(questions, answers)).toBeTruthy();
  });

  it('should return true if there are no required questions', () => {
    const questions = [
      {
        id: 'id1',
        isRequired: false,
      },
      {
        id: 'id2',
        isRequired: false,
      },
    ] as unknown as IServiceQuestion[];
    const answers = [] as IQuestionAnswer[];
    expect(allRequiredQuestionsAnswered(questions, answers)).toBeTruthy();
  });

  it('should return true if there are no questions', () => {
    const questions = [] as IServiceQuestion[];
    const answers = [] as IQuestionAnswer[];
    expect(allRequiredQuestionsAnswered(questions, answers)).toBeTruthy();
  });

  it('should return false if any required questions is undefined', () => {
    const questions = [
      {
        id: 'id1',
        isRequired: true,
      },
    ] as unknown as IServiceQuestion[];
    const answers = [
      {
        questionId: 'id1',
        answer: undefined as unknown as string,
      },
    ] as IQuestionAnswer[];
    expect(allRequiredQuestionsAnswered(questions, answers)).toBeFalsy();
  });

  it('should return false if any required questions is empty', () => {
    const questions = [
      {
        id: 'id1',
        isRequired: true,
      },
    ] as unknown as IServiceQuestion[];
    const answers = [
      {
        questionId: 'id1',
        answer: '' as string,
      },
    ] as IQuestionAnswer[];
    expect(allRequiredQuestionsAnswered(questions, answers)).toBeFalsy();
  });

  it('should return false if any required questions is null', () => {
    const questions = [
      {
        id: 'id1',
        isRequired: true,
      },
    ] as unknown as IServiceQuestion[];
    const answers = [
      {
        questionId: 'id1',
        answer: null as unknown as string,
      },
    ] as IQuestionAnswer[];
    expect(allRequiredQuestionsAnswered(questions, answers)).toBeFalsy();
  });

  it('should return false if any required questions is whitespace', () => {
    const questions = [
      {
        id: 'id1',
        isRequired: true,
      },
    ] as unknown as IServiceQuestion[];
    const answers = [
      {
        questionId: 'id1',
        answer: '   ',
      },
    ] as IQuestionAnswer[];
    expect(allRequiredQuestionsAnswered(questions, answers)).toBeFalsy();
  });
});
