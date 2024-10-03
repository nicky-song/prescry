// Copyright 2021 Prescryptive Health, Inc.

import { IUICMSResponse } from '../../models/api-response/ui-content-response';
import { defaultLanguage, Language } from '../../models/language';
import { IUIContent, IUIContentGroup } from '../../models/ui-content';
import { getNewDate } from '../../utils/date-time/get-new-date';
import { getUICMSContent } from './get-ui-cms-content';

export interface IUIContentResponse {
  groupKey: string;
  fieldKey: string;
  type: string;
  language: string;
  experienceKey: string;
  version: number;
  text: string;
}

export const getStaticUIContentByGroupKey = (
  groupKey: string,
  version = 1,
  language: string = defaultLanguage
) => {
  const uiContentList: IUIContent[] = getUICMSContent()
    .filter(
      (uiContent: IUIContentResponse) =>
        uiContent.groupKey === groupKey &&
        uiContent.version === version &&
        uiContent.language === language
    )
    .map((uiContent: IUIContentResponse) => ({
      fieldKey: uiContent.fieldKey,
      language: uiContent.language,
      value: uiContent.text,
      type: uiContent.type,
    }));
  return uiContentList;
};

export const getUIContentByGroupKey = (
  groupKey: string,
  uiContent: IUICMSResponse[]
): IUIContentGroup => {
  const uiContentGroupList: IUIContentGroup = {
    content: uiContent
      .filter(
        (uiCMSContent: IUICMSResponse) => uiCMSContent.groupKey === groupKey
      )
      .map((uiCMSContent: IUICMSResponse) => ({
        fieldKey: uiCMSContent.fieldKey,
        language: uiCMSContent.language,
        value: uiCMSContent.value,
        type: uiCMSContent.type,
      })),
    lastUpdated: getNewDate().getTime(),
    isContentLoading: false,
  };
  return uiContentGroupList;
};

export const translateContent = (
  content: IUIContent[],
  language: Language
): IUIContent[] => {
  const uiContentMap: Record<string, IUIContent> = content.reduce(
    (allItems, item) => {
      if (
        item.language === language ||
        (!(item.fieldKey in allItems) && item.language === defaultLanguage)
      ) {
        return Object.assign(allItems, { [item.fieldKey]: item });
      } else {
        return allItems;
      }
    },
    {}
  );

  const uiContentList: IUIContent[] = Object.keys(uiContentMap)
    .map((key) => uiContentMap[key])
    .map((uiCMSContent: IUIContent) => ({
      fieldKey: uiCMSContent.fieldKey,
      language: uiCMSContent.language,
      value: uiCMSContent.value,
      type: uiCMSContent.type,
    }));
  return uiContentList;
};
