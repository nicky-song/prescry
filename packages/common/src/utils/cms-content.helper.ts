// Copyright 2021 Prescryptive Health, Inc.

import {
  ReduxDispatch,
  ReduxGetState,
} from '../experiences/guest-experience/context-providers/redux/redux.context';
import {
  getCMSContentAsyncAction,
  IGetCMSContentAsyncActionArgs,
} from '../experiences/guest-experience/state/cms-content/async-actions/get-cms-content.async-action';
import { SessionDispatch } from '../experiences/guest-experience/state/session/dispatch/session.dispatch';
import { IUICMSResponse } from '../models/api-response/ui-content-response';
import { CMSContentVersion } from '../models/cms-content/content-version';
import { CMSExperience } from '../models/cms-content/experience.cms-content';
import { Language } from '../models/language';
import { IUIContent, IUIContentGroup } from '../models/ui-content';
import { getUIContentByGroupKey } from '../utils/content/ui-cms-content';
import { getNewDate } from './date-time/get-new-date';

export interface IGetCMSContent {
  reduxDispatch: ReduxDispatch;
  reduxGetState: ReduxGetState;
  sessionDispatch: SessionDispatch;
  language: Language;
  groupKey: string;
  uiCMSContentMap?: Map<string, IUIContentGroup> | undefined;
  version?: CMSContentVersion;
  experience?: CMSExperience;
  cmsRefreshInterval?: number;
}

export const convertUIContentToMap = (
  responseData: IUICMSResponse[],
  uiCMSContentMap?: Map<string, IUIContentGroup>
) => {
  const groupKeys = [
    ...new Set(responseData.map((uiContent) => uiContent.groupKey)),
  ];

  const returnMap: Map<string, IUIContentGroup> = uiCMSContentMap ?? new Map();

  groupKeys.forEach((groupKey) => {
    returnMap.set(
      groupKey,
      getGroupKeysUIContentGroup(groupKey, responseData, returnMap)
    );
  });

  return returnMap;
};

const getGroupKeysUIContentGroup = (
  groupKey: string,
  responseData: IUICMSResponse[],
  uiContentMap: Map<string, IUIContentGroup>
): IUIContentGroup => {
  const uiContentGroup: IUIContentGroup = getUIContentByGroupKey(
    groupKey,
    responseData
  );
  if (uiContentMap.has(groupKey)) {
    const currentUIContent: IUIContent[] | [] =
      uiContentMap.get(groupKey)?.content ?? [];
    const responseUIContent: IUIContent[] = uiContentGroup.content;

    const mergedandFilteredUIContentMap: IUIContent[] = [
      ...responseUIContent,
      ...currentUIContent,
    ].reduce((unique, o) => {
      if (
        !unique.some(
          (obj: IUIContent) =>
            obj.fieldKey === o.fieldKey && obj.language === o.language
        )
      ) {
        unique.push(o);
      }
      return unique;
    }, [] as IUIContent[]);

    return {
      content: mergedandFilteredUIContentMap,
      lastUpdated: getNewDate().getTime(),
      isContentLoading: false,
    } as IUIContentGroup;
  }

  return uiContentGroup;
};

export const loadDefaultLanguageContentIfSpecifiedAbsent = async (
  reduxDispatch: ReduxDispatch,
  reduxGetState: ReduxGetState,
  sessionDispatch: SessionDispatch,
  specifiedLanguageArgs: IGetCMSContentAsyncActionArgs,
  defaultLanguage: Language,
  groupKey: string,
  uiContentMap: Map<string, IUIContentGroup>,
  queryLanguage?: string,
  experience?: CMSExperience
): Promise<Map<string, IUIContentGroup>> => {
  let result = uiContentMap;

  const language = queryLanguage ?? specifiedLanguageArgs.language;

  if (
    specifiedLanguageArgs.groupKey &&
    language &&
    language !== defaultLanguage &&
    (!uiContentMap?.get(specifiedLanguageArgs.groupKey) ||
      uiContentMap
        ?.get(specifiedLanguageArgs.groupKey)
        ?.content.filter(
          (x: IUIContent) => x.language === specifiedLanguageArgs.language
        ).length === 0)
  ) {
    const defaultLanguageArgs: IGetCMSContentAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      sessionDispatch,
      version: specifiedLanguageArgs.version,
      language: defaultLanguage,
      groupKey,
      uiCMSContentMap: uiContentMap,
      experience,
    };

    result = await getCMSContentAsyncAction(defaultLanguageArgs);
  }

  return result;
};

export const getCMSContent = async (args: IGetCMSContent): Promise<void> => {
  let uiContentMap = new Map();

  const {
    reduxDispatch,
    reduxGetState,
    sessionDispatch,
    language,
    groupKey,
    uiCMSContentMap,
    version,
    experience,
    cmsRefreshInterval,
  } = args;

  const cloneUIContentMap = (k: string, v: IUIContentGroup) => {
    uiContentMap = new Map(uiContentMap.set(k, v));
  };

  if (uiCMSContentMap && uiCMSContentMap?.size > 0) {
    for (const [key, value] of uiCMSContentMap.entries()) {
      cloneUIContentMap(key, value);
    }
  }

  const getCMSContentArgs: IGetCMSContentAsyncActionArgs = {
    reduxDispatch,
    reduxGetState,
    sessionDispatch,
    version: version ?? 1,
    language,
    groupKey,
    uiCMSContentMap,
    experience,
    cmsRefreshInterval,
  };

  const newUIContentMap = await getCMSContentAsyncAction(getCMSContentArgs);

  for (const [key, value] of newUIContentMap.entries()) {
    cloneUIContentMap(key, value);
  }
};
