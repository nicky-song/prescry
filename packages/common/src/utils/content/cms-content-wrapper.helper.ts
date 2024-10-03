// Copyright 2022 Prescryptive Health, Inc.

import { IUICMSResponse } from '../../models/api-response/ui-content-response';
import { Language } from '../../models/language';
import { IUIContent, IUIContentGroup } from '../../models/ui-content';
import {
  translateContent,
  getStaticUIContentByGroupKey,
} from './ui-cms-content';

export const getContent = (
  language: Language,
  content: Map<string, IUIContentGroup> = new Map(),
  groupKey: string,
  version = 1
): IUIContent[] => {
  const cmsContent = content.get(groupKey)?.content;
  return translateContent(
    cmsContent?.length
      ? cmsContent
      : getStaticUIContentByGroupKey(groupKey, version, language),
    language
  );
};

export const findContentValue = (
  fieldKey: string,
  uiContent: IUIContent[] | IUICMSResponse[] = []
): string => uiContent.find((val) => val.fieldKey === fieldKey)?.value ?? '';
