// Copyright 2021 Prescryptive Health, Inc.

import { IFormsContent } from '../../../../../../models/cms-content/forms.ui-content';
import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';
import { formsCMSContentWrapper } from './forms.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('formsCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IFormsContent = {
      dayLabel: 'day-label',
      monthLabel: 'month-label',
      yearLabel: 'year-label',
      dobLabel: 'dob-label',
      ageNotMetError: 'age-not-met-error',
      months: {
        januaryLabel: 'january-label-mock',
        februaryLabel: 'february-label-mock',
        marchLabel: 'march-label-mock',
        aprilLabel: 'april-label-mock',
        mayLabel: 'may-label-mock',
        juneLabel: 'june-label-mock',
        julyLabel: 'july-label-mock',
        augustLabel: 'august-label-mock',
        septemberLabel: 'september-label-mock',
        octoberLabel: 'october-label-mock',
        novemberLabel: 'november-label-mock',
        decemberLabel: 'december-label-mock',
      },
      phoneNumberLabel: 'phone-number-label',
      phoneNumberPlaceholder: 'phone-number-placeholder',
    };

    findContentValueMock.mockReturnValueOnce(expectedContent.dayLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.monthLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.yearLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.dobLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.ageNotMetError);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.months.januaryLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.months.februaryLabel
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.months.marchLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.months.aprilLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.months.mayLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.months.juneLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.months.julyLabel);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.months.augustLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.months.septemberLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.months.octoberLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.months.novemberLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.months.decemberLabel
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.phoneNumberLabel);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.phoneNumberPlaceholder
    );

    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'field-key',
        language: 'English',
        type: 'Text',
        value: 'value',
      },
    ];
    getContentMock.mockReturnValue(uiContentMock);

    const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.forms,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = formsCMSContentWrapper(defaultLanguage, cmsContentMapMock);

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.forms,
      2
    );

    const expectedFieldKeys = [
      'day-label',
      'month-label',
      'year-label',
      'dob-label',
      'age-not-met-error',
      'january-label',
      'february-label',
      'march-label',
      'april-label',
      'may-label',
      'june-label',
      'july-label',
      'august-label',
      'september-label',
      'october-label',
      'november-label',
      'december-label',
      'phone-number-label',
      'phone-number-placeholder',
    ];

    expect(findContentValueMock).toHaveBeenCalledTimes(
      expectedFieldKeys.length
    );
    expectedFieldKeys.forEach((key, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        key,
        uiContentMock
      );
    });

    expect(result).toEqual(expectedContent);
  });
});
